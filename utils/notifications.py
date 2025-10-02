"""
Notification system for sending alerts to users.
Implements MYK Level 5 notification standards.
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import logging
from typing import List

from app import db
from models.models import Notification, User


class NotificationService:
    """Service for managing user notifications."""
    
    def __init__(self):
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
        self.logger = logging.getLogger(__name__)
    
    def create_notification(self, user_id: str, title: str, message: str, 
                          notification_type: str = 'info') -> bool:
        """Create a new notification for a user."""
        try:
            notification = Notification(
                user_id=user_id,
                title=title,
                message=message,
                type=notification_type
            )
            
            db.session.add(notification)
            db.session.commit()
            
            self.logger.info(f"Notification created for user {user_id}: {title}")
            return True
            
        except Exception as e:
            db.session.rollback()
            self.logger.error(f"Failed to create notification: {e}")
            return False
    
    def send_email_notification(self, user_email: str, subject: str, 
                               message: str, html_content: str = None) -> bool:
        """Send email notification to user."""
        try:
            if not self.smtp_username or not self.smtp_password:
                self.logger.warning("SMTP credentials not configured")
                return False
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.smtp_username
            msg['To'] = user_email
            
            # Text content
            text_part = MIMEText(message, 'plain', 'utf-8')
            msg.attach(text_part)
            
            # HTML content if provided
            if html_content:
                html_part = MIMEText(html_content, 'html', 'utf-8')
                msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            self.logger.info(f"Email sent to {user_email}: {subject}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to send email to {user_email}: {e}")
            return False
    
    def notify_price_drop(self, user_id: str, flight_info: dict, old_price: float, new_price: float):
        """Notify user about flight price drop."""
        user = User.query.get(user_id)
        if not user:
            return False
        
        title = "Uçuş Fiyatında Düşüş!"
        message = (
            f"Takip ettiğiniz {flight_info['origin']}-{flight_info['destination']} "
            f"seferinde fiyat düşüşü var!\n\n"
            f"Uçuş: {flight_info['flight_number']}\n"
            f"Havayolu: {flight_info['airline']}\n"
            f"Eski Fiyat: {old_price:.2f} TL\n"
            f"Yeni Fiyat: {new_price:.2f} TL\n"
            f"İndirim: {old_price - new_price:.2f} TL ({((old_price - new_price) / old_price * 100):.1f}%)\n\n"
            f"Hemen rezervasyon yapmak için: {flight_info.get('booking_url', 'N/A')}"
        )
        
        html_message = f"""
        <html>
        <body>
            <h2 style="color: #28a745;">🎉 Uçuş Fiyatında Düşüş!</h2>
            <p>Takip ettiğiniz <strong>{flight_info['origin']}-{flight_info['destination']}</strong> seferinde fiyat düşüşü var!</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #28a745; margin: 15px 0;">
                <p><strong>Uçuş:</strong> {flight_info['flight_number']}</p>
                <p><strong>Havayolu:</strong> {flight_info['airline']}</p>
                <p><strong>Eski Fiyat:</strong> <span style="text-decoration: line-through;">{old_price:.2f} TL</span></p>
                <p><strong>Yeni Fiyat:</strong> <span style="color: #28a745; font-size: 1.2em;">{new_price:.2f} TL</span></p>
                <p><strong>İndirim:</strong> {old_price - new_price:.2f} TL ({((old_price - new_price) / old_price * 100):.1f}%)</p>
            </div>
            
            <p>
                <a href="{flight_info.get('booking_url', '#')}" 
                   style="background-color: #007bff; color: white; padding: 10px 20px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                    Hemen Rezervasyon Yap
                </a>
            </p>
        </body>
        </html>
        """
        
        # Create in-app notification
        self.create_notification(user_id, title, message, 'success')
        
        # Send email notification
        self.send_email_notification(user.email, title, message, html_message)
    
    def notify_flight_reminder(self, user_id: str, flight_info: dict):
        """Notify user about upcoming flight."""
        user = User.query.get(user_id)
        if not user:
            return False
        
        title = "Uçuş Hatırlatması"
        message = (
            f"Yarın uçuşunuz var!\n\n"
            f"Uçuş: {flight_info['flight_number']}\n"
            f"Havayolu: {flight_info['airline']}\n"
            f"Kalkış: {flight_info['departure_time']}\n"
            f"Güvenlik kontrolünden en az 2 saat önce havalimanında bulunmayı unutmayın."
        )
        
        self.create_notification(user_id, title, message, 'info')
        self.send_email_notification(user.email, title, message)
    
    def get_user_notifications(self, user_id: str, limit: int = 10) -> List[Notification]:
        """Get user's recent notifications."""
        return Notification.query.filter_by(user_id=user_id)\
                                .order_by(Notification.created_at.desc())\
                                .limit(limit).all()
    
    def mark_notification_read(self, notification_id: str, user_id: str) -> bool:
        """Mark notification as read."""
        try:
            notification = Notification.query.filter_by(
                id=notification_id,
                user_id=user_id
            ).first()
            
            if notification:
                notification.mark_as_read()
                return True
            
            return False
            
        except Exception as e:
            self.logger.error(f"Failed to mark notification as read: {e}")
            return False
    
    def mark_all_read(self, user_id: str) -> bool:
        """Mark all user notifications as read."""
        try:
            Notification.query.filter_by(user_id=user_id, is_read=False)\
                             .update({'is_read': True})
            db.session.commit()
            return True
            
        except Exception as e:
            db.session.rollback()
            self.logger.error(f"Failed to mark all notifications as read: {e}")
            return False