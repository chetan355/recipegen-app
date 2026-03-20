import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'

const supabaseUrl = "https://avhhthkkxwzwyobpjwwx.supabase.co"
const supabaseAnonKey = "sb_publishable_qURydT75nVNlK-um773PxA_YpgFrtwi"

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
)