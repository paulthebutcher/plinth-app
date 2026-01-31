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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assumptions_ledger: {
        Row: {
          created_at: string | null
          decision_id: string
          id: string
          linked_option_ids: string[] | null
          source: string | null
          statement: string
          status: string | null
          updated_at: string | null
          verification_notes: string | null
        }
        Insert: {
          created_at?: string | null
          decision_id: string
          id?: string
          linked_option_ids?: string[] | null
          source?: string | null
          statement: string
          status?: string | null
          updated_at?: string | null
          verification_notes?: string | null
        }
        Update: {
          created_at?: string | null
          decision_id?: string
          id?: string
          linked_option_ids?: string[] | null
          source?: string | null
          statement?: string
          status?: string | null
          updated_at?: string | null
          verification_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assumptions_ledger_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          decision_id: string
          id: string
          parent_id: string | null
          target_id: string | null
          target_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          decision_id: string
          id?: string
          parent_id?: string | null
          target_id?: string | null
          target_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          decision_id?: string
          id?: string
          parent_id?: string | null
          target_id?: string | null
          target_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_profiles: {
        Row: {
          company_name: string
          company_url: string | null
          created_at: string | null
          decision_id: string
          generated_at: string | null
          id: string
          information_gaps: Json | null
          job_id: string | null
          market_position: Json | null
          model_used: string | null
          overview: Json | null
          product: Json | null
          recent_activity: Json | null
          sources: Json | null
          status: string | null
          strategic_signals: Json | null
          strengths: Json | null
          updated_at: string | null
          weaknesses: Json | null
        }
        Insert: {
          company_name: string
          company_url?: string | null
          created_at?: string | null
          decision_id: string
          generated_at?: string | null
          id?: string
          information_gaps?: Json | null
          job_id?: string | null
          market_position?: Json | null
          model_used?: string | null
          overview?: Json | null
          product?: Json | null
          recent_activity?: Json | null
          sources?: Json | null
          status?: string | null
          strategic_signals?: Json | null
          strengths?: Json | null
          updated_at?: string | null
          weaknesses?: Json | null
        }
        Update: {
          company_name?: string
          company_url?: string | null
          created_at?: string | null
          decision_id?: string
          generated_at?: string | null
          id?: string
          information_gaps?: Json | null
          job_id?: string | null
          market_position?: Json | null
          model_used?: string | null
          overview?: Json | null
          product?: Json | null
          recent_activity?: Json | null
          sources?: Json | null
          status?: string | null
          strategic_signals?: Json | null
          strengths?: Json | null
          updated_at?: string | null
          weaknesses?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "competitor_profiles_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitor_profiles_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      constraints: {
        Row: {
          category: string | null
          created_at: string | null
          decision_id: string
          description: string
          id: string
          severity: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          decision_id: string
          description: string
          id?: string
          severity?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          decision_id?: string
          description?: string
          id?: string
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "constraints_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      decision_changers: {
        Row: {
          condition: string
          created_at: string | null
          decision_id: string
          id: string
          likelihood: string | null
          would_favor: string
        }
        Insert: {
          condition: string
          created_at?: string | null
          decision_id: string
          id?: string
          likelihood?: string | null
          would_favor: string
        }
        Update: {
          condition?: string
          created_at?: string | null
          decision_id?: string
          id?: string
          likelihood?: string | null
          would_favor?: string
        }
        Relationships: [
          {
            foreignKeyName: "decision_changers_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      decisions: {
        Row: {
          analysis_completed_at: string | null
          analysis_started_at: string | null
          analysis_status: string | null
          company_context: string | null
          confidence_rationale: string | null
          confidence_score: number | null
          context: string | null
          created_at: string | null
          deadline: string | null
          decision_frame: string | null
          decision_type: string | null
          falsification_criteria: string | null
          id: string
          metadata: Json | null
          org_id: string
          owner_id: string
          recommendation_id: string | null
          recommendation_rationale: string | null
          reversal_conditions: string | null
          reversibility: number | null
          scope: number | null
          stakes: number | null
          status: string | null
          time_horizon: string | null
          title: string
          type: string | null
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          analysis_completed_at?: string | null
          analysis_started_at?: string | null
          analysis_status?: string | null
          company_context?: string | null
          confidence_rationale?: string | null
          confidence_score?: number | null
          context?: string | null
          created_at?: string | null
          deadline?: string | null
          decision_frame?: string | null
          decision_type?: string | null
          falsification_criteria?: string | null
          id?: string
          metadata?: Json | null
          org_id: string
          owner_id: string
          recommendation_id?: string | null
          recommendation_rationale?: string | null
          reversal_conditions?: string | null
          reversibility?: number | null
          scope?: number | null
          stakes?: number | null
          status?: string | null
          time_horizon?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          analysis_completed_at?: string | null
          analysis_started_at?: string | null
          analysis_status?: string | null
          company_context?: string | null
          confidence_rationale?: string | null
          confidence_score?: number | null
          context?: string | null
          created_at?: string | null
          deadline?: string | null
          decision_frame?: string | null
          decision_type?: string | null
          falsification_criteria?: string | null
          id?: string
          metadata?: Json | null
          org_id?: string
          owner_id?: string
          recommendation_id?: string | null
          recommendation_rationale?: string | null
          reversal_conditions?: string | null
          reversibility?: number | null
          scope?: number | null
          stakes?: number | null
          status?: string | null
          time_horizon?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "decisions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "decisions_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          accessed_at: string | null
          claim: string
          confidence: Json | null
          created_at: string | null
          decision_id: string
          entity_tags: string[] | null
          falsification_criteria: string | null
          id: string
          interpretation: string | null
          notes: string | null
          published_at: string | null
          relevance_tags: string[] | null
          signal_type: string | null
          snippet: string | null
          snippet_hash: string | null
          source_publisher: string | null
          source_title: string | null
          source_type: string | null
          source_url: string | null
          strength: string | null
        }
        Insert: {
          accessed_at?: string | null
          claim: string
          confidence?: Json | null
          created_at?: string | null
          decision_id: string
          entity_tags?: string[] | null
          falsification_criteria?: string | null
          id?: string
          interpretation?: string | null
          notes?: string | null
          published_at?: string | null
          relevance_tags?: string[] | null
          signal_type?: string | null
          snippet?: string | null
          snippet_hash?: string | null
          source_publisher?: string | null
          source_title?: string | null
          source_type?: string | null
          source_url?: string | null
          strength?: string | null
        }
        Update: {
          accessed_at?: string | null
          claim?: string
          confidence?: Json | null
          created_at?: string | null
          decision_id?: string
          entity_tags?: string[] | null
          falsification_criteria?: string | null
          id?: string
          interpretation?: string | null
          notes?: string | null
          published_at?: string | null
          relevance_tags?: string[] | null
          signal_type?: string | null
          snippet?: string | null
          snippet_hash?: string | null
          source_publisher?: string | null
          source_title?: string | null
          source_type?: string | null
          source_url?: string | null
          strength?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_options: {
        Row: {
          evidence_id: string
          id: string
          option_id: string
          relationship: string
        }
        Insert: {
          evidence_id: string
          id?: string
          option_id: string
          relationship: string
        }
        Update: {
          evidence_id?: string
          id?: string
          option_id?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_options_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_options_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string | null
          id: string
          invited_by: string | null
          org_id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          org_id: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string | null
          id?: string
          invited_by?: string | null
          org_id?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          decision_id: string | null
          error: string | null
          id: string
          input: Json
          org_id: string
          output: Json | null
          progress: number | null
          started_at: string | null
          status: string | null
          type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          decision_id?: string | null
          error?: string | null
          id?: string
          input: Json
          org_id: string
          output?: Json | null
          progress?: number | null
          started_at?: string | null
          status?: string | null
          type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          decision_id?: string | null
          error?: string | null
          id?: string
          input?: Json
          org_id?: string
          output?: Json | null
          progress?: number | null
          started_at?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      option_scores: {
        Row: {
          created_at: string | null
          decision_id: string
          id: string
          option_id: string
          overall_score: number | null
          rationale: string | null
          score_breakdown: Json | null
        }
        Insert: {
          created_at?: string | null
          decision_id: string
          id?: string
          option_id: string
          overall_score?: number | null
          rationale?: string | null
          score_breakdown?: Json | null
        }
        Update: {
          created_at?: string | null
          decision_id?: string
          id?: string
          option_id?: string
          overall_score?: number | null
          rationale?: string | null
          score_breakdown?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "option_scores_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "option_scores_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
        ]
      }
      options: {
        Row: {
          ai_analysis: Json | null
          commits_to: string | null
          cons: Json | null
          created_at: string | null
          decision_id: string
          deprioritizes: string | null
          description: string | null
          grounded_in_evidence: string[] | null
          id: string
          primary_risk: string | null
          primary_upside: string | null
          pros: Json | null
          recommendation_rank: number | null
          reversibility_explanation: string | null
          reversibility_level: string | null
          risks: Json | null
          summary: string | null
          title: string
        }
        Insert: {
          ai_analysis?: Json | null
          commits_to?: string | null
          cons?: Json | null
          created_at?: string | null
          decision_id: string
          deprioritizes?: string | null
          description?: string | null
          grounded_in_evidence?: string[] | null
          id?: string
          primary_risk?: string | null
          primary_upside?: string | null
          pros?: Json | null
          recommendation_rank?: number | null
          reversibility_explanation?: string | null
          reversibility_level?: string | null
          risks?: Json | null
          summary?: string | null
          title: string
        }
        Update: {
          ai_analysis?: Json | null
          commits_to?: string | null
          cons?: Json | null
          created_at?: string | null
          decision_id?: string
          deprioritizes?: string | null
          description?: string | null
          grounded_in_evidence?: string[] | null
          id?: string
          primary_risk?: string | null
          primary_upside?: string | null
          pros?: Json | null
          recommendation_rank?: number | null
          reversibility_explanation?: string | null
          reversibility_level?: string | null
          risks?: Json | null
          summary?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "options_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
          plan: string | null
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          plan?: string | null
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          plan?: string | null
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      outputs: {
        Row: {
          content: string | null
          created_at: string | null
          decision_id: string
          error_message: string | null
          format: string | null
          generated_at: string | null
          id: string
          is_shared: boolean | null
          share_key: string | null
          status: string | null
          type: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          decision_id: string
          error_message?: string | null
          format?: string | null
          generated_at?: string | null
          id?: string
          is_shared?: boolean | null
          share_key?: string | null
          status?: string | null
          type: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          decision_id?: string
          error_message?: string | null
          format?: string | null
          generated_at?: string | null
          id?: string
          is_shared?: boolean | null
          share_key?: string | null
          status?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "outputs_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          confidence: number | null
          created_at: string | null
          decision_id: string
          hedge_condition: string | null
          hedge_option_id: string | null
          id: string
          monitor_triggers: Json | null
          primary_option_id: string | null
          rationale: string | null
          updated_at: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          decision_id: string
          hedge_condition?: string | null
          hedge_option_id?: string | null
          id?: string
          monitor_triggers?: Json | null
          primary_option_id?: string | null
          rationale?: string | null
          updated_at?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          decision_id?: string
          hedge_condition?: string | null
          hedge_option_id?: string | null
          id?: string
          monitor_triggers?: Json | null
          primary_option_id?: string | null
          rationale?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: true
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_hedge_option_id_fkey"
            columns: ["hedge_option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_primary_option_id_fkey"
            columns: ["primary_option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
        ]
      }
      stakeholders: {
        Row: {
          concerns: string | null
          created_at: string | null
          decision_id: string
          id: string
          name: string
          role: string | null
          stance: string | null
        }
        Insert: {
          concerns?: string | null
          created_at?: string | null
          decision_id: string
          id?: string
          name: string
          role?: string | null
          stance?: string | null
        }
        Update: {
          concerns?: string | null
          created_at?: string | null
          decision_id?: string
          id?: string
          name?: string
          role?: string | null
          stance?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stakeholders_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
        ]
      }
      tradeoffs: {
        Row: {
          accepted: boolean | null
          created_at: string | null
          decision_id: string
          gets: string
          gives_up: string
          id: string
          option_id: string | null
        }
        Insert: {
          accepted?: boolean | null
          created_at?: string | null
          decision_id: string
          gets: string
          gives_up: string
          id?: string
          option_id?: string | null
        }
        Update: {
          accepted?: boolean | null
          created_at?: string | null
          decision_id?: string
          gets?: string
          gives_up?: string
          id?: string
          option_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tradeoffs_decision_id_fkey"
            columns: ["decision_id"]
            isOneToOne: false
            referencedRelation: "decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tradeoffs_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "options"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          org_id: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          org_id?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          org_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
