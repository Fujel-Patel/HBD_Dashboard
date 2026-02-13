from extensions import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # Changed from password_hash to password since it's no longer a hash
    password = db.Column(db.String(200), nullable=False) 
    
    # Forgot Password OTP fields
    reset_otp = db.Column(db.String(6), nullable=True)
    reset_otp_expiry = db.Column(db.DateTime, nullable=True)

    def set_password(self, password):
        # DIRECT ASSIGNMENT - NO ENCRYPTION
        self.password = password

    def check_password(self, password):
        # DIRECT COMPARISON
        return self.password == password