-- Safety net: Auto-create user record if missing when they first access the app
-- This handles edge cases where the auth callback might fail silently

-- Function to ensure user exists in public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_org_id uuid;
  slug_base text;
BEGIN
  -- Check if user already exists in public.users
  IF EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- Create slug from email
  slug_base := COALESCE(split_part(NEW.email, '@', 1), 'user-' || substr(NEW.id::text, 1, 8));

  -- Create organization for the user
  INSERT INTO public.organizations (name, slug, plan)
  VALUES ('My Organization', slug_base || '-' || substr(NEW.id::text, 1, 8), 'trial')
  RETURNING id INTO new_org_id;

  -- Create user record
  INSERT INTO public.users (id, email, full_name, org_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    new_org_id,
    'admin'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires after a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
