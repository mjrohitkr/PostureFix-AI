import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Activity, BarChart3, User, LogOut, Dumbbell, Menu, X, Crown, CreditCard } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Activity },
    { to: '/trainer', label: 'AI Trainer', icon: Dumbbell },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/services', label: 'Service', icon: Crown },
    { to: '/about', label: 'About', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 crystal-glass" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/' : '/'} className="flex items-center gap-3" data-testid="nav-logo">
            <div className="w-10 h-10 rounded-lg bg-[#FF3B30] flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-xl uppercase tracking-wider hidden sm:block">
              PostureFix AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                    isActive(link.to)
                      ? 'text-[#FF3B30]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 text-zinc-400 hover:text-white"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  data-testid="mobile-menu-btn"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 focus:outline-none" data-testid="nav-avatar">
                      <Avatar className="w-9 h-9 border-2 border-[#FF3B30]/50">
                        <AvatarImage src={user?.avatar_url || ""} alt={user?.name} />
                        <AvatarFallback className="bg-[#FF3B30] text-white font-bold text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:block text-sm font-medium text-white whitespace-nowrap">
                        {user?.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 z-[100]">
                    <DropdownMenuLabel className="text-zinc-400">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold">{user.name}</span>
                          {(user.plan === 'pro_monthly' || user.plan === 'pro_yearly') && (
                            <Crown className="w-4 h-4 text-[#FBBF24]" />
                          )}
                        </div>
                        <span className="text-xs">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                      onClick={() => navigate('/profile')}
                      data-testid="nav-profile-link"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:bg-zinc-800 focus:bg-zinc-800"
                      onClick={() => navigate('/subscription')}
                      data-testid="nav-subscription-link"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Subscription
                      {!user.has_premium_access && !user.is_trial_active && (
                        <span className="ml-auto text-xs text-[#FF3B30]">Upgrade</span>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem
                      className="cursor-pointer text-[#FF3B30] hover:bg-zinc-800 focus:bg-zinc-800"
                      onClick={handleLogout}
                      data-testid="nav-logout-btn"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                  data-testid="nav-login-btn"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#FF3B30] text-white text-sm font-bold uppercase tracking-wider px-4 py-2 hover:bg-[#FF6B63] transition-colors"
                  data-testid="nav-register-btn"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.to)
                      ? 'bg-[#FF3B30]/10 text-[#FF3B30]'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-semibold">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
