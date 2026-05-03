import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { api } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit2, 
  Save, 
  X, 
  Loader2,
  Camera,
  Upload,
  Crown,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export function ProfilePage() {
  const { user, updateProfile, checkAuth } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfile({
      name: name || user?.name,
      avatar_url: avatarUrl || null,
    });

    if (result.success) {
      toast.success('Profile updated successfully!');
      setEditing(false);
    } else {
      toast.error(result.error);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setAvatarUrl(user?.avatar_url || '');
    setImagePreview(null);
    setEditing(false);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    console.log("FILE:", file);
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPEG, PNG, GIF, or WebP.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum 5MB allowed.');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem("token");

const response = await fetch("http://localhost:5000/api/user/upload-image", {
  method: "POST",
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
  body: formData,
});

const data = await response.json();
console.log(data);

      toast.success('Profile image uploaded successfully!');

      // 👇 NEW ADD (IMPORTANT)
      if (response.data?.avatar_url) {
  setAvatarUrl(response.data.avatar_url);
}

// Refresh user data
await checkAuth();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  // Predefined avatar options
  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=fitness1',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=fitness2',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=fitness3',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=fitness4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=fitness5',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=fitness6',
  ];

  // Get subscription info
  const getPlanBadge = () => {
    const plan = user?.plan || 'free';
    if (plan === 'pro_monthly' || plan === 'pro_yearly') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#FF3B30] to-[#FBBF24] text-white">
          <Crown className="w-3 h-3" />
          PRO
        </span>
      );
    }
    if (user?.is_trial_active) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00F0FF]/20 text-[#00F0FF]">
          <Clock className="w-3 h-3" />
          TRIAL ({user.trial_days_remaining}d left)
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-zinc-700 text-zinc-300">
        FREE
      </span>
    );
  };

  // Determine profile image URL
const getProfileImageUrl = () => {
  if (imagePreview) return imagePreview;

  if (avatarUrl) return avatarUrl; // 👈 NEW

  if (user?.profile_image_path) {
    const token = localStorage.getItem('token');
    return `${process.env.REACT_APP_BACKEND_URL}/api/user/image/${user.profile_image_path}?auth=${token}`;
  }

  return user?.avatar_url || "";
};

  return (
    <div className="min-h-screen bg-[#09090B]" data-testid="profile-page">
      <Navbar />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-4xl sm:text-5xl uppercase tracking-wider mb-2">
              Profile
            </h1>
            <p className="text-zinc-400">Manage your account settings</p>
          </div>

          {/* Subscription Status Banner */}
          {!user?.has_premium_access && !user?.is_trial_active && (
            <Card className="bg-gradient-to-r from-[#FF3B30]/20 to-[#FBBF24]/20 border-[#FF3B30]/30 mb-6">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="w-6 h-6 text-[#FBBF24]" />
                  <div>
                    <p className="font-semibold text-white">Upgrade to Pro</p>
                    <p className="text-sm text-zinc-400">Unlock all features and unlimited workouts</p>
                  </div>
                </div>
                <Link
                  to="/subscription"
                  className="bg-[#FF3B30] text-white font-bold uppercase tracking-wider px-6 py-2 hover:bg-[#FF6B63] transition-colors"
                  data-testid="upgrade-btn"
                >
                  Upgrade
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Profile Card */}
          <Card className="bg-zinc-900/50 border-zinc-800 mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">Personal Information</CardTitle>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-[#FF3B30] hover:text-[#FF6B63] transition-colors"
                  data-testid="edit-profile-btn"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    data-testid="cancel-edit-btn"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 text-[#34D399] hover:text-[#34D399]/80 transition-colors disabled:opacity-50"
                    data-testid="save-profile-btn"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save
                  </button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Avatar Section with Upload */}
              <div className="flex flex-col items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-[#FF3B30]/30">
                    <AvatarImage src={getProfileImageUrl() || ""} alt={user?.name} />
                    <AvatarFallback className="bg-[#FF3B30] text-white font-heading text-4xl">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Upload overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    data-testid="upload-image-btn"
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <Camera className="w-8 h-8 text-white" />
                    )}
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    data-testid="file-input"
                  />
                </div>

                <p className="text-sm text-zinc-400">Click avatar to upload new image</p>

                {editing && (
                  <div className="w-full">
                    <Label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3 block">
                      Or Choose Avatar
                    </Label>
                    <div className="flex flex-wrap justify-center gap-3">
                      {avatarOptions.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => setAvatarUrl(url)}
                          className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
                            avatarUrl === url
                              ? 'border-[#FF3B30] scale-110'
                              : 'border-zinc-700 hover:border-zinc-500'
                          }`}
                        >
                          <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full" />
                        </button>
                      ))}
                      <button
                        onClick={() => setAvatarUrl('')}
                        className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all ${
                          !avatarUrl
                            ? 'border-[#FF3B30] scale-110 bg-[#FF3B30]/20'
                            : 'border-zinc-700 hover:border-zinc-500 bg-zinc-800'
                        }`}
                      >
                        <User className="w-6 h-6 text-zinc-400" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  {editing ? (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 bg-zinc-950 border-zinc-800 text-white focus:border-[#FF3B30] focus:ring-[#FF3B30]"
                      data-testid="profile-name-input"
                    />
                  ) : (
                    <div className="h-12 px-4 flex items-center bg-zinc-950 border border-zinc-800 rounded-md text-white">
                      {user?.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <div className="h-12 px-4 flex items-center bg-zinc-950 border border-zinc-800 rounded-md text-zinc-400">
                    {user?.email}
                  </div>
                  <p className="text-xs text-zinc-500">Email cannot be changed</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Member Since
                    </Label>
                    <div className="h-12 px-4 flex items-center bg-zinc-950 border border-zinc-800 rounded-md text-zinc-400">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : 'N/A'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Subscription
                    </Label>
                    <div className="h-12 px-4 flex items-center bg-zinc-950 border border-zinc-800 rounded-md">
                      {getPlanBadge()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#FBBF24]" />
                Subscription Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg mb-4">
                <div>
                  <p className="font-semibold text-white capitalize">
                    {user?.plan === 'pro_monthly' ? 'Pro Monthly' : 
                     user?.plan === 'pro_yearly' ? 'Pro Yearly' : 'Free Plan'}
                  </p>
                  {user?.subscription_expiry && (
                    <p className="text-sm text-zinc-400">
                      Expires: {new Date(user.subscription_expiry).toLocaleDateString()}
                    </p>
                  )}
                  {user?.is_trial_active && (
                    <p className="text-sm text-[#00F0FF]">
                      Trial ends in {user.trial_days_remaining} days
                    </p>
                  )}
                </div>
                <Link
                  to="/subscription"
                  className="text-[#FF3B30] hover:text-[#FF6B63] font-semibold text-sm"
                >
                  {user?.has_premium_access ? 'Manage' : 'Upgrade'} →
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#34D399]/10 border border-[#34D399]/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#34D399] rounded-full animate-pulse" />
                  <span className="font-medium text-[#34D399]">Account Active</span>
                </div>
                <span className="text-zinc-400 text-sm">Your account is in good standing</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
