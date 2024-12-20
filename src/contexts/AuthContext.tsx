import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  userData: any;
  companyData: any;
  accessTypeData: any;
  loading: boolean;
  empresa_id: number | null;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  userData: null, 
  companyData: null,
  accessTypeData: null,
  loading: true, 
  empresa_id: null,
  refreshUserData: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);
  const [accessTypeData, setAccessTypeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchAccessTypeData = async (tipoAcesso: number) => {
    try {
      const { data, error } = await supabase
        .from('tipo_de_acesso')
        .select('*')
        .eq('id', tipoAcesso)
        .single();

      if (error) throw error;
      setAccessTypeData(data);
      return data;
    } catch (error) {
      console.error('Error fetching access type data:', error);
      setAccessTypeData(null);
      return null;
    }
  };

  const fetchCompanyData = async (empresaId: number) => {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', empresaId)
        .single();

      if (error) throw error;
      setCompanyData(data);
      return data;
    } catch (error) {
      console.error('Error fetching company data:', error);
      setCompanyData(null);
      return null;
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setUserData(data);
      
      // Fetch company and access type data in parallel
      if (data) {
        await Promise.all([
          data.empresa_id ? fetchCompanyData(data.empresa_id) : null,
          data.tipo_acesso ? fetchAccessTypeData(data.tipo_acesso) : null
        ]);
      }

      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null);
      setCompanyData(null);
      setAccessTypeData(null);
      return null;
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.id);
    }
  };

  // Initial session check
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkSession();
  }, []);

  // Auth state change listener
  useEffect(() => {
    if (!initialized) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setUserData(null);
          setCompanyData(null);
          setAccessTypeData(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [initialized]);

  const value = {
    user,
    userData,
    companyData,
    accessTypeData,
    loading,
    empresa_id: userData?.empresa_id ?? null,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
