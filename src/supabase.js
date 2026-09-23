export const supabaseUrl = 'https://mneyifneyierorcswfqr.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZXlpZm5leWllcm9yY3N3ZnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1MzQ0NzUsImV4cCI6MjEwMDExMDQ3NX0.IkP5Avsj4B0N3hedPu2Vrdx0MCleDHbAkC7ZOLh5sJk';

import { createClient } from '@supabase/supabase-js';

console.log("Inicializando cliente Supabase...");
export const supabase = createClient(supabaseUrl, supabaseKey);
console.log("Cliente Supabase inicializado com sucesso!");
