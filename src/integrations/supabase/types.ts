export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      abandoned_checkout_email_queue: {
        Row: {
          created_at: string
          email: string
          error_message: string | null
          id: string
          lead_id: string
          name: string | null
          scheduled_for: string
          sent_at: string | null
          sequence_number: number
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          error_message?: string | null
          id?: string
          lead_id: string
          name?: string | null
          scheduled_for: string
          sent_at?: string | null
          sequence_number: number
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          error_message?: string | null
          id?: string
          lead_id?: string
          name?: string | null
          scheduled_for?: string
          sent_at?: string | null
          sequence_number?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "abandoned_checkout_email_queue_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "clinic_growth_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_growth_leads: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          lead_status: string
          onboarding_biggest_frustration: string | null
          onboarding_completed: boolean
          onboarding_completed_at: string | null
          onboarding_decision_reasons: Json | null
          onboarding_done_for_you_interest: string | null
          onboarding_implementation_help: Json | null
          onboarding_other_help: string | null
          onboarding_primary_goals: Json | null
          onboarding_skepticism: string | null
          onboarding_tried_before: Json | null
          oto_accepted: boolean
          oto_full_name: string | null
          oto_payment_amount: number | null
          oto_payment_screenshot_url: string | null
          oto_payment_submitted: boolean
          oto_status: string | null
          oto_submitted_at: string | null
          oto_transaction_id: string | null
          oto_whatsapp: string | null
          payment_method: string
          payment_screenshot_url: string | null
          registration_email_error: string | null
          registration_email_sent: boolean
          registration_email_sent_at: string | null
          selected_order_bumps: Json
          specialty: string | null
          strategy_session_order_bump_selected: boolean
          total_amount: number
          whatsapp: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          lead_status?: string
          onboarding_biggest_frustration?: string | null
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
          onboarding_decision_reasons?: Json | null
          onboarding_done_for_you_interest?: string | null
          onboarding_implementation_help?: Json | null
          onboarding_other_help?: string | null
          onboarding_primary_goals?: Json | null
          onboarding_skepticism?: string | null
          onboarding_tried_before?: Json | null
          oto_accepted?: boolean
          oto_full_name?: string | null
          oto_payment_amount?: number | null
          oto_payment_screenshot_url?: string | null
          oto_payment_submitted?: boolean
          oto_status?: string | null
          oto_submitted_at?: string | null
          oto_transaction_id?: string | null
          oto_whatsapp?: string | null
          payment_method: string
          payment_screenshot_url?: string | null
          registration_email_error?: string | null
          registration_email_sent?: boolean
          registration_email_sent_at?: string | null
          selected_order_bumps?: Json
          specialty?: string | null
          strategy_session_order_bump_selected?: boolean
          total_amount: number
          whatsapp: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          lead_status?: string
          onboarding_biggest_frustration?: string | null
          onboarding_completed?: boolean
          onboarding_completed_at?: string | null
          onboarding_decision_reasons?: Json | null
          onboarding_done_for_you_interest?: string | null
          onboarding_implementation_help?: Json | null
          onboarding_other_help?: string | null
          onboarding_primary_goals?: Json | null
          onboarding_skepticism?: string | null
          onboarding_tried_before?: Json | null
          oto_accepted?: boolean
          oto_full_name?: string | null
          oto_payment_amount?: number | null
          oto_payment_screenshot_url?: string | null
          oto_payment_submitted?: boolean
          oto_status?: string | null
          oto_submitted_at?: string | null
          oto_transaction_id?: string | null
          oto_whatsapp?: string | null
          payment_method?: string
          payment_screenshot_url?: string | null
          registration_email_error?: string | null
          registration_email_sent?: boolean
          registration_email_sent_at?: string | null
          selected_order_bumps?: Json
          specialty?: string | null
          strategy_session_order_bump_selected?: boolean
          total_amount?: number
          whatsapp?: string
        }
        Relationships: []
      }
      clinic_growth_onboarding_responses: {
        Row: {
          biggest_frustration: string | null
          city: string | null
          created_at: string
          decision_reasons: Json
          done_for_you_interest: string | null
          email: string
          full_name: string | null
          id: string
          implementation_help: Json
          lead_id: string
          other_help: string | null
          primary_goals: Json
          skepticism: string | null
          specialty: string | null
          tried_before: Json
          updated_at: string
          whatsapp: string
        }
        Insert: {
          biggest_frustration?: string | null
          city?: string | null
          created_at?: string
          decision_reasons?: Json
          done_for_you_interest?: string | null
          email: string
          full_name?: string | null
          id?: string
          implementation_help?: Json
          lead_id: string
          other_help?: string | null
          primary_goals?: Json
          skepticism?: string | null
          specialty?: string | null
          tried_before?: Json
          updated_at?: string
          whatsapp: string
        }
        Update: {
          biggest_frustration?: string | null
          city?: string | null
          created_at?: string
          decision_reasons?: Json
          done_for_you_interest?: string | null
          email?: string
          full_name?: string | null
          id?: string
          implementation_help?: Json
          lead_id?: string
          other_help?: string | null
          primary_goals?: Json
          skepticism?: string | null
          specialty?: string | null
          tried_before?: Json
          updated_at?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinic_growth_onboarding_responses_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "clinic_growth_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      patient_acquisition_orders: {
        Row: {
          amount: number
          city: string | null
          clinic_name: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          optional_message: string | null
          order_status: string
          payment_method: string | null
          payment_screenshot_url: string | null
          source: string | null
          specialty: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          amount?: number
          city?: string | null
          clinic_name?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          optional_message?: string | null
          order_status?: string
          payment_method?: string | null
          payment_screenshot_url?: string | null
          source?: string | null
          specialty: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          amount?: number
          city?: string | null
          clinic_name?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          optional_message?: string | null
          order_status?: string
          payment_method?: string | null
          payment_screenshot_url?: string | null
          source?: string | null
          specialty?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
