import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Camera, Save, X, Eye, EyeOff, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ImageCropModal from '../components/ImageCropModal';

const ProfileSettings = () => {
  const { t, i18n } = useTranslation();
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const fileInputRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    toast.success(lng === 'en' ? 'Language changed to English' : 'Lingua cambiata in Italiano');
  };

  // Load saved profile picture from local storage on mount
  useEffect(() => {
    const savedProfilePicture = localStorage.getItem('profilePicture');
    if (savedProfilePicture) {
      setProfileData(prev => ({
        ...prev,
        profilePicturePreview: savedProfilePicture,
      }));
    }
  }, []);

  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Software developer passionate about creating elegant solutions.',
    profilePicture: null,
    profilePicturePreview: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('profile.profilePicture.errorSize'));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t('profile.profilePicture.errorType'));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageUrl, croppedFile) => {
    // Save cropped image to local storage
    localStorage.setItem('profilePicture', croppedImageUrl);
    
    setProfileData(prev => ({
      ...prev,
      profilePicture: croppedFile,
      profilePicturePreview: croppedImageUrl,
    }));
    setIsDirty(true);
    setShowCropModal(false);
    setImageToCrop(null);
    toast.success(t('profile.profilePicture.cropped'));
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeProfilePicture = () => {
    // Remove profile picture from local storage
    localStorage.removeItem('profilePicture');
    
    setProfileData(prev => ({
      ...prev,
      profilePicture: null,
      profilePicturePreview: null,
    }));
    setIsDirty(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success(t('profile.profilePicture.removed'));
  };

  const validateProfile = () => {
    const errors = {};

    if (!profileData.firstName.trim()) {
      errors.firstName = t('profile.validation.firstNameRequired');
    }

    if (!profileData.lastName.trim()) {
      errors.lastName = t('profile.validation.lastNameRequired');
    }

    if (!profileData.email.trim()) {
      errors.email = t('profile.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = t('profile.validation.emailInvalid');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};

    if (passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword) {
      if (!passwordData.currentPassword) {
        errors.currentPassword = t('profile.validation.currentPasswordRequired');
      }

      if (!passwordData.newPassword) {
        errors.newPassword = t('profile.validation.newPasswordRequired');
      } else if (passwordData.newPassword.length < 8) {
        errors.newPassword = t('profile.validation.passwordTooShort');
      }

      if (!passwordData.confirmPassword) {
        errors.confirmPassword = t('profile.validation.confirmPasswordRequired');
      } else if (passwordData.newPassword !== passwordData.confirmPassword) {
        errors.confirmPassword = t('profile.validation.passwordsNoMatch');
      }
    }

    setValidationErrors(prev => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      toast.error(t('profile.validation.fixErrors'));
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Here you would normally send the data to your backend
      console.log('Saving profile:', profileData);

      toast.success(t('profile.notifications.profileUpdated'));
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(t('profile.notifications.profileUpdateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      toast.error(t('profile.validation.fixPasswordErrors'));
      return;
    }

    if (!passwordData.currentPassword && !passwordData.newPassword) {
      toast(t('profile.notifications.noPasswordChanges'));
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Here you would normally send the data to your backend
      console.log('Changing password');

      toast.success(t('profile.notifications.passwordChanged'));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(t('profile.notifications.passwordChangeFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    // Reset to original values
    setProfileData({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      bio: 'Software developer passionate about creating elegant solutions.',
      profilePicture: null,
      profilePicturePreview: null,
    });
    setIsDirty(false);
    setValidationErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast(t('profile.notifications.changesDiscarded'));
  };

  return (
  <div className="p-6" style={{ background: 'transparent' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold text-[hsl(var(--text-black))]">{t('profile.title')}</h1>
        {isDirty && (
          <span className="px-3 py-1 bg-[hsl(var(--red))/0.15] text-[hsl(var(--text-black))] border-2 border-[hsl(var(--red))] rounded-full text-xs font-bold animate-pulse">
            ⚠️ {t('profile.unsavedChanges')}
          </span>
        )}
        <span className="text-sm text-[hsl(var(--text-black))] opacity-70 ml-auto font-medium">
          {t('profile.subtitle')}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Picture */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-[hsl(var(--border-black))] rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[hsl(var(--text-black))] mb-4">{t('profile.profilePicture.title')}</h2>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {profileData.profilePicturePreview ? (
                  <img
                    src={profileData.profilePicturePreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center border-2 border-[hsl(var(--border-black))] bg-[hsl(var(--gray))]"
                  >
                    <User className="w-16 h-16 text-[hsl(var(--text-black))] opacity-40" />
                  </div>
                )}
                
                {profileData.profilePicturePreview && (
                  <button
                    onClick={removeProfilePicture}
                    className="absolute top-0 right-0 p-1 bg-[hsl(var(--red))] text-[hsl(var(--text-black))] rounded-full hover:bg-[hsl(0 85% 45%)] transition-all shadow-lg"
                    title="Remove picture"
                    aria-label="Remove profile picture"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-picture-upload"
              />
              
              <label
                htmlFor="profile-picture-upload"
                className="btn btn-secondary cursor-pointer flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                {profileData.profilePicturePreview ? t('profile.profilePicture.change') : t('profile.profilePicture.upload')}
              </label>
              
              <p className="text-xs text-[hsl(var(--text-black))] opacity-70 text-center mt-3">
                {t('profile.profilePicture.recommended')}
                <br />
                {t('profile.profilePicture.maxSize')}
              </p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-white border-2 border-[hsl(var(--border-black))] rounded-lg p-6 mt-6 shadow-sm">
            <h2 className="text-lg font-bold text-[hsl(var(--text-black))] mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('profile.language.title')}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => changeLanguage('en')}
                className={`btn flex-1 ${
                  i18n.language === 'en' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                🇬🇧 {t('profile.language.english')}
              </button>
              <button
                onClick={() => changeLanguage('it')}
                className={`btn flex-1 ${
                  i18n.language === 'it' ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                🇮🇹 {t('profile.language.italian')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white border-2 border-[hsl(var(--border-black))] rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[hsl(var(--text-black))] mb-4">{t('profile.personalInfo.title')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[hsl(var(--text-black))] mb-1">
                  {t('profile.personalInfo.firstName')} <span className="text-[hsl(var(--text-black))]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-black))] opacity-60" />
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    className={`input w-full pl-10 pr-3 text-sm text-[hsl(var(--text-black))] ${validationErrors.firstName ? 'border-[hsl(var(--red))] focus:border-[hsl(var(--red))]' : ''}`}
                    placeholder={t('profile.personalInfo.firstNamePlaceholder')}
                  />
                </div>
                {validationErrors.firstName && (
                  <p className="text-xs text-[hsl(var(--text-black))] mt-1 font-semibold">{validationErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(var(--text-black))] mb-1">
                  {t('profile.personalInfo.lastName')} <span className="text-[hsl(var(--text-black))]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-black))]" />
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    className={`input w-full pl-10 pr-3 text-sm text-[hsl(var(--text-black))] ${validationErrors.lastName ? 'border-[hsl(var(--red))]' : ''}`}
                    placeholder={t('profile.personalInfo.lastNamePlaceholder')}
                  />
                </div>
                {validationErrors.lastName && (
                  <p className="text-xs text-[hsl(var(--text-black))] mt-1">{validationErrors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(var(--text-black))] mb-1">
                  {t('profile.personalInfo.email')} <span className="text-[hsl(var(--text-black))]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-black))]" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className={`input w-full pl-10 pr-3 text-sm text-[hsl(var(--text-black))] ${validationErrors.email ? 'border-[hsl(var(--red))]' : ''}`}
                    placeholder={t('profile.personalInfo.emailPlaceholder')}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-xs text-[hsl(var(--text-black))] mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[hsl(var(--text-black))] mb-1">
                  {t('profile.personalInfo.phone')}
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  className="input w-full pl-3 pr-3 text-sm text-[hsl(var(--text-black))]"
                  placeholder={t('profile.personalInfo.phonePlaceholder')}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-[hsl(var(--text-black))] mb-1">
                {t('profile.personalInfo.bio')}
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                className="input w-full pl-3 pr-3 text-sm text-[hsl(var(--text-black))] resize-none"
                rows="4"
                placeholder={t('profile.personalInfo.bioPlaceholder')}
              />
              <p className="text-xs text-[hsl(var(--text-black))] opacity-70 mt-1">
                {profileData.bio.length}/500 {t('profile.personalInfo.charactersLabel')}
              </p>
            </div>
          </div>

          {/* Change Password */}
          <div style={{ background: 'hsl(var(--panel))' }} className="border border-[hsl(var(--border-black))] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[hsl(var(--text-black))] mb-4">{t('profile.password.title')}</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }} autoComplete="on">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--text-black))] mb-1">
                    {t('profile.password.current')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-black))]" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className={`input w-full pl-10 pr-10 text-sm text-[hsl(var(--text-black))] ${validationErrors.currentPassword ? 'border-[hsl(var(--red))]' : ''}`}
                      placeholder={t('profile.password.currentPlaceholder')}
                      autoComplete="current-password"
                      name="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-black))] hover:text-[hsl(var(--text-black))] transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4 text-[hsl(var(--text-black))]" /> : <Eye className="w-4 h-4 text-[hsl(var(--text-black))]" />}
                    </button>
                  </div>
                  {validationErrors.currentPassword && (
                    <p className="text-xs text-[hsl(var(--text-black))] mt-1">{validationErrors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--text-black))] mb-1">
                    {t('profile.password.new')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-black))]" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className={`input w-full pl-10 pr-10 text-sm text-[hsl(var(--text-black))] ${validationErrors.newPassword ? 'border-[hsl(var(--red))]' : ''}`}
                      placeholder={t('profile.password.newPlaceholder')}
                      autoComplete="new-password"
                      name="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-black))] hover:text-[hsl(var(--text-black))] transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4 text-[hsl(var(--text-black))]" /> : <Eye className="w-4 h-4 text-[hsl(var(--text-black))]" />}
                    </button>
                  </div>
                  {validationErrors.newPassword && (
                    <p className="text-xs text-[hsl(var(--text-black))] mt-1">{validationErrors.newPassword}</p>
                  )}
                  <p className="text-xs text-[hsl(var(--text-black))] opacity-70 mt-1">
                    {t('profile.password.requirement')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[hsl(var(--text-black))] mb-1">
                    {t('profile.password.confirm')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-black))]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={`input w-full pl-10 pr-10 text-sm text-[hsl(var(--text-black))] ${validationErrors.confirmPassword ? 'border-[hsl(var(--red))]' : ''}`}
                      placeholder={t('profile.password.confirmPlaceholder')}
                      autoComplete="new-password"
                      name="confirm-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-black))] hover:text-[hsl(var(--text-black))] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 text-[hsl(var(--text-black))]" /> : <Eye className="w-4 h-4 text-[hsl(var(--text-black))]" />}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-xs text-[hsl(var(--text-black))] mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={saving || (!passwordData.currentPassword && !passwordData.newPassword && !passwordData.confirmPassword)}
                  className="btn btn-primary text-[hsl(var(--text-black))]"
                >
                  <Lock className="w-4 h-4 text-[hsl(var(--text-black))]" />
                  {saving ? t('profile.actions.changing') : t('profile.actions.changePassword')}
                </button>
              </div>
            </form>
          </div>

          {/* Account Information */}
          <div style={{ background: 'hsl(var(--panel))' }} className="border border-[hsl(var(--border-black))] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[hsl(var(--text-black))] mb-4">{t('profile.accountInfo.title')}</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-[hsl(var(--text-black))] opacity-70">{t('profile.accountInfo.status')}</span>
                <span className="text-sm font-medium text-[hsl(var(--text-black))]">{t('profile.accountInfo.active')}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-[hsl(var(--text-black))] opacity-70">{t('profile.accountInfo.memberSince')}</span>
                <span className="text-sm font-medium text-[hsl(var(--text-black))]">January 15, 2024</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-[hsl(var(--text-black))] opacity-70">{t('profile.accountInfo.lastLogin')}</span>
                <span className="text-sm font-medium text-[hsl(var(--text-black))]">October 13, 2025 at 10:30 AM</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-[hsl(var(--text-black))] opacity-70">{t('profile.accountInfo.accountId')}</span>
                <span className="text-sm font-mono text-[hsl(var(--text-black))]">#USR-2024-001</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Crop Modal */}
      {showCropModal && imageToCrop && (
        <ImageCropModal
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default ProfileSettings;

