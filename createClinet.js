import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';
//const apiUrl:'';
//const apiKey:;
export const supabase = createClient(
  'https://wqepzbjbtoyjworkjbde.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZXB6YmpidG95andvcmtqYmRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExOTU3NzgsImV4cCI6MjAzNjc3MTc3OH0.GVRcbki-UIGWU_xGCZ8DfYKrIcf8N3BAkF1mHiYkpXk',
);
