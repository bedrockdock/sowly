/* ---- Supabase: inloggen en online tuin (alleen in de webversie; build.js voegt dit bestand toe) ---- */
/* De URL en de publishable key zijn niet geheim: ze staan altijd in de pagina. Wie wat mag, regelt supabase.sql. */
const SB_URL='https://xkreecbnockrjrisbswj.supabase.co';
const SB_KEY='sb_publishable_7JrHyuG9RPju02dWM8XaNA_UiEWYRHe';
const SB_V='2.118.0';
async function sbLoad(){
  const {createClient}=await import(`https://cdn.jsdelivr.net/npm/@supabase/supabase-js@${SB_V}/+esm`);
  return createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
}
