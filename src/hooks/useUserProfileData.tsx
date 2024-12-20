import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { normalizePhone } from "@/components/company/CompanyFormUtils";

export const useUserProfileData = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [accessType, setAccessType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState({
    name: "",
    email: "",
    phone: "",
    photo: null as string | null,
    company: "",
    accessType: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select(`
            nome_usuario,
            email_user,
            telefone_user,
            foto_perfil,
            empresa:empresas(nome),
            tipo:tipo_de_acesso(permissoes_acesso)
          `)
          .eq('user_id', user.id)
          .single();

        if (userError) throw userError;

        const userEmail = userData.email_user || user.email;

        if (!userData.email_user && user.email) {
          await supabase
            .from('usuarios')
            .update({ email_user: user.email })
            .eq('user_id', user.id);
        }

        setName(userData.nome_usuario || "");
        setEmail(userEmail || "");
        setPhone(userData.telefone_user || "");
        setPhoto(userData.foto_perfil);
        setCompany(userData.empresa?.nome || "");
        setAccessType(userData.tipo?.permissoes_acesso || "");

        setInitialData({
          name: userData.nome_usuario || "",
          email: userEmail || "",
          phone: userData.telefone_user || "",
          photo: userData.foto_perfil,
          company: userData.empresa?.nome || "",
          accessType: userData.tipo?.permissoes_acesso || ""
        });
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        toast.error("Erro ao carregar dados do usuário");
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Remove o prefixo +55 e todos os caracteres não numéricos antes de contar
      const phoneDigits = phone.replace(/^\+55\s?/, '').replace(/\D/g, "");
      
      if (phoneDigits.length > 0 && (phoneDigits.length < 10 || phoneDigits.length > 11)) {
        toast.error("Número de telefone inválido. Digite um número com DDD + número (10 ou 11 dígitos)");
        setIsLoading(false);
        return false;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não encontrado");

      // Normaliza o telefone antes de salvar
      const normalizedPhone = phone ? normalizePhone(phone) : null;

      const { error } = await supabase
        .from('usuarios')
        .update({
          nome_usuario: name,
          telefone_user: normalizedPhone,
          foto_perfil: photo
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setInitialData({
        ...initialData,
        name,
        phone,
        photo
      });

      toast.success("Perfil atualizado com sucesso!");
      return true;
    } catch (error: any) {
      console.error('Erro ao salvar perfil:', error);
      toast.error("Erro ao atualizar perfil");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    phone,
    setPhone,
    photo,
    setPhoto,
    company,
    accessType,
    isLoading,
    initialData,
    handleSave
  };
};