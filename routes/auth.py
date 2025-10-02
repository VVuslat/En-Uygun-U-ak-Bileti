"""
Authentication routes for user registration and login.
Implements MYK Level 5 security standards.
"""

from flask import Blueprint, render_template, request, flash, redirect, url_for, current_app
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import check_password_hash
from datetime import datetime
import re

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    """User registration endpoint."""
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    
    if request.method == 'POST':
        from app import db
        from models.models import User
        from utils.forms import RegistrationForm
        
        form = RegistrationForm()
        
        if form.validate():
            # Check if user already exists
            existing_user = User.query.filter_by(email=form.data['email'].lower()).first()
            if existing_user:
                flash('Bu e-posta adresi zaten kayıtlı.', 'error')
                return render_template('auth/register.html', form=form)
            
            # Create new user
            try:
                user = User(
                    email=form.data['email'].lower().strip(),
                    first_name=form.data['first_name'].strip(),
                    last_name=form.data['last_name'].strip()
                )
                user.set_password(form.data['password'])
                
                db.session.add(user)
                db.session.commit()
                
                flash('Kayıt başarıyla tamamlandı. Şimdi giriş yapabilirsiniz.', 'success')
                return redirect(url_for('auth.login'))
                
            except Exception as e:
                db.session.rollback()
                flash('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.', 'error')
                return render_template('auth/register.html', form=form)
        else:
            # Show validation errors
            for field, errors in form.errors.items():
                for error in errors:
                    flash(error, 'error')
            return render_template('auth/register.html', form=form)
    
    from utils.forms import RegistrationForm
    return render_template('auth/register.html', form=RegistrationForm())


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """User login endpoint."""
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    
    if request.method == 'POST':
        from app import db
        from models.models import User
        from utils.forms import LoginForm
        
        form = LoginForm()
        
        if form.validate():
            user = User.query.filter_by(email=form.data['email'].lower()).first()
            
            if user and user.check_password(form.data['password']):
                if not user.is_active:
                    flash('Hesabınız devre dışı bırakılmış.', 'error')
                    return render_template('auth/login.html', form=form)
                
                # Update last login time
                user.last_login = datetime.utcnow()
                db.session.commit()
                
                remember_me = form.data.get('remember_me') == 'on'
                login_user(user, remember=remember_me)
                
                # Redirect to next page or dashboard
                next_page = request.args.get('next')
                if not next_page or not next_page.startswith('/'):
                    next_page = url_for('main.dashboard')
                
                flash(f'Hoş geldiniz, {user.get_full_name()}!', 'success')
                return redirect(next_page)
            else:
                flash('Geçersiz e-posta veya şifre.', 'error')
        else:
            # Show validation errors
            for field, errors in form.errors.items():
                for error in errors:
                    flash(error, 'error')
    
    from utils.forms import LoginForm
    return render_template('auth/login.html', form=LoginForm())


@auth_bp.route('/logout')
@login_required
def logout():
    """User logout endpoint."""
    logout_user()
    flash('Başarıyla çıkış yaptınız.', 'info')
    return redirect(url_for('main.index'))


@auth_bp.route('/profile')
@login_required
def profile():
    """User profile page."""
    return render_template('auth/profile.html', user=current_user)