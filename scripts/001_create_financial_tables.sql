-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table (bank accounts, credit cards, etc.)
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checking', 'savings', 'credit_card', 'investment', 'loan')),
  balance DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create budgets table
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('monthly', 'yearly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create savings goals table
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  target_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for accounts
CREATE POLICY "Users can view their own accounts" ON public.accounts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own accounts" ON public.accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own accounts" ON public.accounts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own accounts" ON public.accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON public.transactions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON public.transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for budgets
CREATE POLICY "Users can view their own budgets" ON public.budgets
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own budgets" ON public.budgets
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own budgets" ON public.budgets
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own budgets" ON public.budgets
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for savings goals
CREATE POLICY "Users can view their own savings goals" ON public.savings_goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own savings goals" ON public.savings_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own savings goals" ON public.savings_goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own savings goals" ON public.savings_goals
  FOR DELETE USING (auth.uid() = user_id);
