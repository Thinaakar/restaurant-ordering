# Authentication System - Quick Start Guide

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- Next.js 14+ project setup
- Tailwind CSS configured
- React 18+ installed

---

## 📁 File Structure

```
src/
├── app/
│   └── (auth)/
│       ├── login/
│       │   └── page.tsx           # Main auth page (all views)
│       ├── register/
│       │   └── page.tsx           # Redirects to login?view=register
│       └── forgot-password/
│           └── page.tsx           # Redirects to login?view=forgot
└── hooks/
    └── use-auth.tsx                # Authentication logic
```

---

## 🎯 Quick Access URLs

### Available Routes

```bash
http://localhost:3000/login                    # Login page (default)
http://localhost:3000/login?view=register      # Create account
http://localhost:3000/login?view=forgot        # Reset password
http://localhost:3000/register                 # Redirects to register view
http://localhost:3000/forgot-password          # Redirects to forgot view
```

### Demo Credentials

```
Email:    admin@restaurant.com
Password: admin123
```

---

## 🔧 Installation & Setup

### Step 1: Install Dependencies

```bash
npm install lucide-react
# or
yarn add lucide-react
```

### Step 2: Verify Tailwind Config

Ensure your `tailwind.config.js` includes the new animations:

```javascript
module.exports = {
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
      },
    },
  },
};
```

### Step 3: Test the Application

```bash
npm run dev
# or
yarn dev
```

Navigate to `http://localhost:3000/login` to see the new authentication system.

---

## 🎨 Customization Guide

### 1. Update Branding

**Logo and Brand Name:**

```typescript
// In LeftPanel component
<div className="flex items-center gap-3 mb-14">
  <div className="flex h-11 w-11 ...">
    <ChefHat className="h-6 w-6 text-white" />  // Replace with your logo
  </div>
  <div className="flex flex-col">
    <span className="text-2xl font-bold text-white">
      Your Brand                                  // Update brand name
    </span>
  </div>
</div>
```

**Tagline:**

```typescript
<h1 className="text-5xl xl:text-6xl font-bold ...">
  Your Custom Tagline Here                       // Update tagline
</h1>
```

### 2. Customize Features

Update the `FEATURES` array:

```typescript
const FEATURES = [
  {
    icon: YourIcon,
    title: "Your Feature Title",
    desc: "Your feature description.",
    color: "bg-amber-50 text-amber-600",
    gradient: "from-amber-500/20 to-amber-600/20",
  },
  // Add more features...
];
```

### 3. Customize Preview Cards

Update the `PREVIEW_CARDS` array:

```typescript
const PREVIEW_CARDS = [
  {
    label: "Your Metric",
    value: "$12,345",
    change: "+15%",
    positive: true,
    icon: TrendingUp,
  },
  // Add more cards...
];
```

### 4. Update Testimonials

Modify the `TESTIMONIALS` array:

```typescript
const TESTIMONIALS = [
  {
    text: "Your testimonial text",
    author: "Customer Name",
    restaurant: "Company Name",
  },
  // Add more testimonials...
];
```

### 5. Change Color Scheme

**Primary Colors (Amber → Your Color):**

```typescript
// Replace all instances of:
amber-400 → yourcolor-400
amber-500 → yourcolor-500
amber-600 → yourcolor-600
```

### 6. Update Validation Rules

**Password Requirements:**

```typescript
// In validate function
if (password.length < 8)
  // Change minimum length
  e.password = "Minimum 8 characters";

// Add additional rules:
if (!/[A-Z]/.test(password)) e.password = "Must contain uppercase letter";
```

**Email Validation:**

```typescript
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Modify regex if needed
```

---

## 🔐 Authentication Integration

### Using the Auth Hook

```typescript
import { useAuth } from '@/hooks/use-auth';

function YourComponent() {
  const { user, login, register, resetPassword, logout, isAuthenticated } = useAuth();

  // Login
  const handleLogin = (email: string, password: string) => {
    const success = login(email, password);
    if (success) {
      // Redirect or show success
    }
  };

  // Register
  const handleRegister = (name: string, restaurant: string, email: string, password: string) => {
    const success = register(name, restaurant, email, password);
    if (success) {
      // Redirect or show success
    }
  };

  // Reset Password
  const handleReset = (email: string, newPassword: string) => {
    const success = resetPassword(email, newPassword);
    if (success) {
      // Show success message
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    // Redirect to login
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}
```

### Connect to Your Backend

Replace mock authentication in `use-auth.tsx`:

```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("aura_admin_user", JSON.stringify(data.user));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login error:", error);
    return false;
  }
};
```

---

## 🎯 Common Tasks

### Add a New Input Field

```typescript
<InputField
  id="your-field-id"
  label="Your Label"
  type="text"
  value={yourValue}
  onChange={setYourValue}
  placeholder="Enter..."
  icon={YourIcon}
  error={errors.yourField}
/>
```

### Add a New Validation Rule

```typescript
const validate = () => {
  const e: Record<string, string> = {};

  // Add your validation
  if (!yourField) {
    e.yourField = "This field is required";
  }

  return e;
};
```

### Add Loading State

```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    // Your async operation
  } finally {
    setLoading(false);
  }
};
```

### Add Success Message

```typescript
const [success, setSuccess] = useState(false);

if (success) {
  return (
    <div className="animate-fade-in text-center py-12">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-lg shadow-emerald-200/50 mx-auto mb-6">
        <Check className="h-10 w-10 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">
        Success!
      </h2>
      <p className="text-sm text-slate-600 mb-10 max-w-sm mx-auto">
        Your success message here
      </p>
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Issue: Styles not applying

**Solution:** Ensure Tailwind is properly configured and the content paths include your files:

```javascript
content: ["./src/**/*.{js,ts,jsx,tsx}"];
```

### Issue: Animations not working

**Solution:** Check that the keyframes are defined in `tailwind.config.js` and you're using the correct animation class names.

### Issue: Icons not showing

**Solution:** Verify lucide-react is installed:

```bash
npm install lucide-react
```

### Issue: Forms not validating

**Solution:** Check that error states are being set correctly and the validation function is being called on submit.

### Issue: Redirects not working

**Solution:** Verify Next.js router is imported correctly:

```typescript
import { useRouter } from "next/navigation";
```

### Issue: Mobile responsiveness problems

**Solution:** Test with different viewport sizes and adjust Tailwind breakpoints as needed.

---

## 📱 Testing Checklist

### Desktop Testing

- [ ] All three views (login, register, forgot) display correctly
- [ ] Tab navigation works smoothly
- [ ] Form validation shows appropriate messages
- [ ] Submit buttons have correct states (enabled/disabled/loading)
- [ ] Success states animate properly
- [ ] Demo credentials autofill works
- [ ] Left panel displays all content
- [ ] Hover effects work on all interactive elements

### Tablet Testing (768px - 1023px)

- [ ] Layout adjusts appropriately
- [ ] All content remains accessible
- [ ] Touch targets are large enough
- [ ] Forms remain usable

### Mobile Testing (< 768px)

- [ ] Vertical layout stacks correctly
- [ ] Mobile logo shows at top
- [ ] All form fields are accessible
- [ ] Buttons are touch-friendly (48px+ height)
- [ ] Keyboard doesn't obscure inputs
- [ ] Tab switcher works on small screens

### Cross-Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Screen reader announces content
- [ ] Color contrast meets WCAG standards
- [ ] Error messages are announced

---

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] Update demo credentials or remove them
- [ ] Connect to real authentication backend
- [ ] Test all authentication flows
- [ ] Verify error handling
- [ ] Check loading states
- [ ] Test password reset emails (if applicable)
- [ ] Ensure HTTPS is enabled
- [ ] Configure CORS if needed
- [ ] Set up rate limiting
- [ ] Add analytics tracking

### Post-Deployment

- [ ] Test on production environment
- [ ] Verify all routes work
- [ ] Check SSL certificate
- [ ] Monitor error logs
- [ ] Test from different devices
- [ ] Verify email delivery (reset password)
- [ ] Check performance metrics
- [ ] Set up monitoring alerts

---

## 📚 Additional Resources

### Documentation

- [Full Documentation](./AUTH_REDESIGN_DOCUMENTATION.md)
- [Visual Design Guide](./AUTH_VISUAL_GUIDE.md)

### Related Files

- Authentication Logic: `src/hooks/use-auth.tsx`
- Main Auth Page: `src/app/(auth)/login/page.tsx`
- Tailwind Config: `tailwind.config.js`

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/) (optional)

---

## 💡 Pro Tips

1. **Use Real Data Early**: Replace mock authentication as soon as possible to catch integration issues early.

2. **Test Edge Cases**: Try submitting empty forms, invalid emails, mismatched passwords, etc.

3. **Optimize Images**: Use WebP format and proper sizing for any background images or logos.

4. **Monitor Performance**: Keep an eye on page load times and animation smoothness.

5. **Accessibility Matters**: Always test with keyboard navigation and screen readers.

6. **Mobile First**: Design for mobile and scale up, not the other way around.

7. **User Feedback**: Always provide clear feedback for user actions (loading, success, error).

8. **Security First**: Never expose sensitive data, always use HTTPS, implement rate limiting.

---

## 🎉 Success!

You now have a premium, modern SaaS-style authentication system!

For questions or issues, refer to the comprehensive documentation or the troubleshooting section above.

**Happy coding! 🚀**
