"""
Notification Service Module
Bildirim servisi modülü
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import json

class NotificationService:
    """Bildirim servisi sınıfı - Notification service class"""
    
    def __init__(self):
        self.email_config = {
            'smtp_server': os.getenv('SMTP_SERVER', 'smtp.gmail.com'),
            'smtp_port': int(os.getenv('SMTP_PORT', '587')),
            'email': os.getenv('EMAIL_ADDRESS'),
            'password': os.getenv('EMAIL_PASSWORD')
        }
        self.notification_history = []
        
    def send_notification(self, recipient, message, notification_type='email', subject=None):
        """Bildirim gönder - Send notification"""
        try:
            if notification_type == 'email':
                return self._send_email(recipient, message, subject)
            elif notification_type == 'sms':
                return self._send_sms(recipient, message)
            elif notification_type == 'push':
                return self._send_push_notification(recipient, message)
            else:
                print(f"Desteklenmeyen bildirim türü: {notification_type}")
                return False
        except Exception as e:
            print(f"Bildirim gönderme hatası: {e}")
            return False
    
    def _send_email(self, recipient, message, subject=None):
        """E-posta gönder - Send email"""
        if not self.email_config['email'] or not self.email_config['password']:
            print("E-posta bildirim simülasyonu:")
            print(f"Alıcı: {recipient}")
            print(f"Konu: {subject or 'En Uygun Uçak Bileti Bildirimi'}")
            print(f"Mesaj: {message}")
            self._log_notification(recipient, message, 'email', True)
            return True
        
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.email_config['email']
            msg['To'] = recipient
            msg['Subject'] = subject or 'En Uygun Uçak Bileti Bildirimi'
            
            # Add message body
            msg.attach(MIMEText(message, 'plain', 'utf-8'))
            
            # Connect to server and send email
            server = smtplib.SMTP(self.email_config['smtp_server'], self.email_config['smtp_port'])
            server.starttls()
            server.login(self.email_config['email'], self.email_config['password'])
            
            text = msg.as_string()
            server.sendmail(self.email_config['email'], recipient, text)
            server.quit()
            
            self._log_notification(recipient, message, 'email', True)
            return True
            
        except Exception as e:
            print(f"E-posta gönderme hatası: {e}")
            self._log_notification(recipient, message, 'email', False)
            return False
    
    def _send_sms(self, recipient, message):
        """SMS gönder - Send SMS"""
        # Mock SMS service (in real implementation, integrate with SMS provider)
        print("SMS bildirim simülasyonu:")
        print(f"Telefon: {recipient}")
        print(f"Mesaj: {message}")
        
        self._log_notification(recipient, message, 'sms', True)
        return True
    
    def _send_push_notification(self, recipient, message):
        """Push bildirimi gönder - Send push notification"""
        # Mock push notification service
        print("Push bildirim simülasyonu:")
        print(f"Kullanıcı: {recipient}")
        print(f"Mesaj: {message}")
        
        self._log_notification(recipient, message, 'push', True)
        return True
    
    def send_price_alert(self, user_email, flight_details, target_price, current_price):
        """Fiyat uyarısı gönder - Send price alert"""
        subject = "🎯 Fiyat Uyarısı - Hedef Fiyat Düştü!"
        
        message = f"""
Merhaba,

Takip ettiğiniz uçuş için fiyat düşüşü tespit edildi!

Uçuş Detayları:
• Güzergah: {flight_details.get('departure', 'N/A')} → {flight_details.get('destination', 'N/A')}
• Tarih: {flight_details.get('date', 'N/A')}
• Havayolu: {flight_details.get('airline', 'N/A')}

Fiyat Bilgileri:
• Hedef Fiyat: {target_price} TL
• Mevcut Fiyat: {current_price} TL
• Tasarruf: {target_price - current_price} TL

Hemen rezervasyon yapmak için linke tıklayın:
{flight_details.get('booking_url', '#')}

En Uygun Uçak Bileti Ekibi
"""
        
        return self.send_notification(user_email, message, 'email', subject)
    
    def send_booking_confirmation(self, user_email, booking_details):
        """Rezervasyon onayı gönder - Send booking confirmation"""
        subject = "✅ Rezervasyon Onayı"
        
        message = f"""
Rezervasyonunuz başarıyla alındı!

Rezervasyon Detayları:
• Rezervasyon Kodu: {booking_details.get('confirmation_code', 'N/A')}
• Güzergah: {booking_details.get('departure', 'N/A')} → {booking_details.get('destination', 'N/A')}
• Tarih: {booking_details.get('date', 'N/A')}
• Saat: {booking_details.get('time', 'N/A')}
• Yolcu: {booking_details.get('passenger_name', 'N/A')}
• Toplam Tutar: {booking_details.get('total_price', 'N/A')} TL

Check-in işlemi için havayolu web sitesini ziyaret edin.

İyi yolculuklar!
En Uygun Uçak Bileti Ekibi
"""
        
        return self.send_notification(user_email, message, 'email', subject)
    
    def send_flight_reminder(self, user_email, flight_details, hours_before=24):
        """Uçuş hatırlatması gönder - Send flight reminder"""
        subject = f"✈️ Uçuş Hatırlatması - {hours_before} Saat Kaldı"
        
        message = f"""
Uçuşunuza {hours_before} saat kaldı!

Uçuş Detayları:
• Güzergah: {flight_details.get('departure', 'N/A')} → {flight_details.get('destination', 'N/A')}
• Tarih: {flight_details.get('date', 'N/A')}
• Kalkış Saati: {flight_details.get('departure_time', 'N/A')}
• Havayolu: {flight_details.get('airline', 'N/A')}
• Uçuş No: {flight_details.get('flight_number', 'N/A')}

Hatırlatmalar:
• Havalimanına en az 2 saat önce gelin
• Check-in işlemini unutmayın
• Kimlik belgilerinizi yanınıza alın
• Bagaj limitlerini kontrol edin

İyi yolculuklar!
En Uygun Uçak Bileti Ekibi
"""
        
        return self.send_notification(user_email, message, 'email', subject)
    
    def send_deal_alert(self, user_email, deal_details):
        """Fırsat uyarısı gönder - Send deal alert"""
        subject = "🔥 Süper Fırsat - Sınırlı Süreli İndirim!"
        
        message = f"""
Kaçırılmayacak fırsat!

Fırsat Detayları:
• Güzergah: {deal_details.get('departure', 'N/A')} → {deal_details.get('destination', 'N/A')}
• Normal Fiyat: {deal_details.get('normal_price', 'N/A')} TL
• İndirimli Fiyat: {deal_details.get('discounted_price', 'N/A')} TL
• İndirim Oranı: %{deal_details.get('discount_percentage', 'N/A')}
• Geçerlilik: {deal_details.get('valid_until', 'N/A')}

Bu fırsatı kaçırmayın! Hemen rezervasyon yapın.

En Uygun Uçak Bileti Ekibi
"""
        
        return self.send_notification(user_email, message, 'email', subject)
    
    def _log_notification(self, recipient, message, notification_type, success):
        """Bildirim geçmişini kaydet - Log notification history"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'recipient': recipient,
            'message': message[:100] + '...' if len(message) > 100 else message,
            'type': notification_type,
            'success': success
        }
        
        self.notification_history.append(log_entry)
        
        # Keep only last 1000 notifications
        if len(self.notification_history) > 1000:
            self.notification_history = self.notification_history[-1000:]
    
    def get_notification_history(self, recipient=None, limit=50):
        """Bildirim geçmişini getir - Get notification history"""
        history = self.notification_history
        
        if recipient:
            history = [n for n in history if n['recipient'] == recipient]
        
        return history[-limit:] if limit else history
    
    def create_price_watch(self, user_email, flight_criteria, target_price):
        """Fiyat takibi oluştur - Create price watch"""
        watch_id = f"watch_{len(self.notification_history)}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # Store price watch (in real implementation, this would be in database)
        watch_data = {
            'id': watch_id,
            'user_email': user_email,
            'criteria': flight_criteria,
            'target_price': target_price,
            'created_at': datetime.now().isoformat(),
            'active': True
        }
        
        # Mock confirmation
        confirmation_message = f"""
Fiyat takibi başarıyla oluşturuldu!

Takip ID: {watch_id}
Güzergah: {flight_criteria.get('departure')} → {flight_criteria.get('destination')}
Hedef Fiyat: {target_price} TL

Fiyat hedefi altına düştüğünde bildirim alacaksınız.
"""
        
        self.send_notification(user_email, confirmation_message, 'email', 'Fiyat Takibi Onayı')
        
        return watch_id
    
    def get_notification_settings(self, user_email):
        """Bildirim ayarlarını getir - Get notification settings"""
        # Mock settings (in real implementation, this would be from database)
        return {
            'email_enabled': True,
            'sms_enabled': False,
            'push_enabled': True,
            'price_alerts': True,
            'deal_alerts': True,
            'flight_reminders': True,
            'marketing_emails': False
        }
    
    def update_notification_settings(self, user_email, settings):
        """Bildirim ayarlarını güncelle - Update notification settings"""
        # Mock update (in real implementation, this would update database)
        success_message = "Bildirim ayarlarınız başarıyla güncellendi."
        self.send_notification(user_email, success_message, 'email', 'Ayarlar Güncellendi')
        return True