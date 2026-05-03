import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from '../components/Navbar';
import { api } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Crown, 
  Check, 
  Zap, 
  Shield, 
  Clock,
  Loader2,
  Star,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export function SubscriptionPage() {
  const { user, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/api/subscription/plans');
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (planId) => {
    if (planId === 'free') {
      toast.info('You are already on the free plan');
      return;
    }

    setProcessingPlan(planId);

    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Create order
      const orderResponse = await api.post(
        '/api/payment/create-order',
        { plan_id: planId },
        { headers }
      );

      const { order_id, amount, currency, key_id, plan_name, user_name, user_email } = orderResponse.data;

      if (!key_id) {
        toast.error('Payment service not configured. Please contact support.');
        setProcessingPlan(null);
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setProcessingPlan(null);
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: 'PostureFix AI',
        description: `${plan_name} Subscription`,
        order_id: order_id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await api.post(
              '/api/payment/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan_id: planId,
              },
              { headers }
            );

            if (verifyResponse.data.success) {
              toast.success('Subscription activated successfully!');
              await checkAuth(); // Refresh user data
              navigate('/dashboard');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user_name,
          email: user_email,
        },
        theme: {
          color: '#FF3B30',
        },
        modal: {
          ondismiss: () => {
            setProcessingPlan(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      toast.error(error.response?.data?.detail || 'Failed to initiate payment');
    } finally {
      setProcessingPlan(null);
    }
  };

  const isCurrentPlan = (planId) => {
    return user?.plan === planId;
  };

  const getPlanIcon = (planId) => {
    switch (planId) {
      case 'free':
        return <Shield className="w-8 h-8" />;
      case 'pro_monthly':
        return <Zap className="w-8 h-8" />;
      case 'pro_yearly':
        return <Crown className="w-8 h-8" />;
      default:
        return <Star className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B]" data-testid="subscription-page">
      <Navbar />

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#FF3B30]" />
              <span className="text-sm font-semibold text-[#FF3B30] uppercase tracking-wider">
                Subscription Plans
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl uppercase tracking-wider mb-4">
              Choose Your Plan
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Unlock your full fitness potential with PostureFix AI Pro
            </p>
          </div>

          {/* Trial Banner */}
          {user?.is_trial_active && (
            <div className="mb-8 p-4 bg-gradient-to-r from-[#00F0FF]/20 to-[#34D399]/20 border border-[#00F0FF]/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-[#00F0FF]" />
                <div>
                  <p className="font-semibold text-white">Free Trial Active</p>
                  <p className="text-sm text-zinc-400">
                    {user.trial_days_remaining} days remaining - Enjoy all Pro features!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Plans Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-12 h-12 text-[#FF3B30] animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative bg-zinc-900/50 border-zinc-800 transition-all hover:border-zinc-700 ${
                    plan.is_popular ? 'ring-2 ring-[#FF3B30] border-[#FF3B30]' : ''
                  } ${isCurrentPlan(plan.id) ? 'border-[#34D399]' : ''}`}
                >
                  {plan.is_popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF3B30] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                      Most Popular
                    </div>
                  )}

                  {isCurrentPlan(plan.id) && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#34D399] text-black text-xs font-bold uppercase tracking-wider rounded-full">
                      Current Plan
                    </div>
                  )}

                  <CardHeader className="text-center pt-8">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                        plan.id === 'free'
                          ? 'bg-zinc-800 text-zinc-400'
                          : plan.id === 'pro_monthly'
                          ? 'bg-[#FF3B30]/20 text-[#FF3B30]'
                          : 'bg-gradient-to-br from-[#FF3B30]/20 to-[#FBBF24]/20 text-[#FBBF24]'
                      }`}
                    >
                      {getPlanIcon(plan.id)}
                    </div>
                    <CardTitle className="text-2xl font-heading uppercase tracking-wider">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price_display}</span>
                      {plan.period !== 'forever' && (
                        <span className="text-zinc-400">/{plan.period}</span>
                      )}
                    </div>
                    {plan.savings && (
                      <p className="mt-2 text-sm text-[#34D399] font-semibold">
                        {plan.savings}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="pb-8">
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check
                            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              plan.id === 'free' ? 'text-zinc-500' : 'text-[#34D399]'
                            }`}
                          />
                          <span className="text-zinc-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={processingPlan === plan.id || isCurrentPlan(plan.id)}
                      className={`w-full py-4 font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        plan.id === 'free'
                          ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                          : plan.is_popular
                          ? 'bg-[#FF3B30] text-white hover:bg-[#FF6B63]'
                          : 'bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700'
                      }`}
                      data-testid={`subscribe-${plan.id}-btn`}
                    >
                      {processingPlan === plan.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </span>
                      ) : isCurrentPlan(plan.id) ? (
                        'Current Plan'
                      ) : plan.id === 'free' ? (
                        'Free Forever'
                      ) : (
                        `Subscribe Now`
                      )}
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Features Comparison */}
          <div className="mt-16">
            <h2 className="font-heading text-2xl uppercase tracking-wider text-center mb-8">
              Compare Features
            </h2>
            <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left p-4 font-semibold text-zinc-400">Feature</th>
                      <th className="text-center p-4 font-semibold text-zinc-400">Free</th>
                      <th className="text-center p-4 font-semibold text-[#FF3B30]">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: 'Exercise Types', free: 'Basic', pro: 'All Exercises' },
                      { feature: 'Daily Workouts', free: '3/day', pro: 'Unlimited' },
                      { feature: 'Workout History', free: '7 days', pro: 'Unlimited' },
                      { feature: 'Posture Correction', free: 'Basic', pro: 'Advanced AI' },
                      { feature: 'Voice Feedback', free: '✓', pro: '✓' },
                      { feature: 'Analytics', free: '7 days', pro: 'Full History' },
                      { feature: 'Priority Support', free: '—', pro: '✓' },
                    ].map((row, index) => (
                      <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="p-4 text-white">{row.feature}</td>
                        <td className="p-4 text-center text-zinc-400">{row.free}</td>
                        <td className="p-4 text-center text-[#34D399]">{row.pro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="font-heading text-2xl uppercase tracking-wider text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: 'What happens after my free trial?',
                  a: 'After your 3-day free trial, you\'ll be moved to the Free plan unless you subscribe to Pro. You can upgrade anytime.',
                },
                {
                  q: 'Can I cancel my subscription?',
                  a: 'Yes, you can cancel anytime. Your Pro features will remain active until the end of your billing period.',
                },
                {
                  q: 'What payment methods are supported?',
                  a: 'We accept all major credit/debit cards, UPI, net banking, and wallets through Razorpay.',
                },
                {
                  q: 'Is my payment information secure?',
                  a: 'Yes, all payments are processed securely through Razorpay with PCI DSS compliance.',
                },
              ].map((faq, index) => (
                <Card key={index} className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                    <p className="text-zinc-400 text-sm">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
