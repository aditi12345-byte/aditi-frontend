/**
 * User Model definition & validation
 */

class User {
  constructor({ id, name, email, password_hash, created_at }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password_hash = password_hash;
    this.created_at = created_at || new Date().toISOString();
  }

  static validate(data) {
    const errors = [];
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Valid email address is required');
    }
    if (data.password && data.password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      created_at: this.created_at
    };
  }
}

module.exports = User;
