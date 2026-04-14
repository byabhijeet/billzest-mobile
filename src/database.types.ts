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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_system_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          payload: Json
          processed: boolean | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          payload: Json
          processed?: boolean | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed?: boolean | null
        }
        Relationships: []
      }
      alert_rules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          notification_channels: Json | null
          organization_id: string | null
          rule_type: string
          threshold: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notification_channels?: Json | null
          organization_id?: string | null
          rule_type: string
          threshold: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notification_channels?: Json | null
          organization_id?: string | null
          rule_type?: string
          threshold?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "alert_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "alert_rules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      app_features: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          module: Database["public"]["Enums"]["app_module_type"]
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          module: Database["public"]["Enums"]["app_module_type"]
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          module?: Database["public"]["Enums"]["app_module_type"]
          name?: string
        }
        Relationships: []
      }
      app_super_admins: {
        Row: {
          created_at: string | null
          email: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      apps: {
        Row: {
          app_link: string | null
          app_logo: string | null
          app_name: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          app_link?: string | null
          app_logo?: string | null
          app_name: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          app_link?: string | null
          app_logo?: string | null
          app_name?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_log_immutable: {
        Row: {
          action: string
          created_at: string
          current_hash: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          organization_id: string
          previous_hash: string | null
          resource_id: string | null
          resource_type: string
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          current_hash: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          organization_id: string
          previous_hash?: string | null
          resource_id?: string | null
          resource_type: string
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          current_hash?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          organization_id?: string
          previous_hash?: string | null
          resource_id?: string | null
          resource_type?: string
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          new_value: Json | null
          old_value: Json | null
          organization_id: string | null
          resource_id: string | null
          resource_type: string
          severity: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type: string
          severity?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_value?: Json | null
          old_value?: Json | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string
          severity?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      batches: {
        Row: {
          batch_number: string
          created_at: string
          expiry_date: string | null
          id: string
          is_active: boolean | null
          mfg_date: string | null
          mrp: number | null
          organization_id: string
          product_id: string
          purchase_price: number | null
          quantity: number | null
          selling_price: number | null
          updated_at: string
          user_id: string
          variant_id: string | null
        }
        Insert: {
          batch_number: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          mfg_date?: string | null
          mrp?: number | null
          organization_id: string
          product_id: string
          purchase_price?: number | null
          quantity?: number | null
          selling_price?: number | null
          updated_at?: string
          user_id: string
          variant_id?: string | null
        }
        Update: {
          batch_number?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          mfg_date?: string | null
          mrp?: number | null
          organization_id?: string
          product_id?: string
          purchase_price?: number | null
          quantity?: number | null
          selling_price?: number | null
          updated_at?: string
          user_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "batches_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "batches_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "batches_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "batches_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batches_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      bill_config: {
        Row: {
          created_at: string | null
          font_size: string | null
          footer_text: string | null
          header_text: string | null
          id: string
          logo_url: string | null
          organization_id: string
          paper_size: string | null
          print_qr_code: boolean | null
          qr_code_data: string | null
          show_logo: boolean | null
          show_tax_details: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          font_size?: string | null
          footer_text?: string | null
          header_text?: string | null
          id?: string
          logo_url?: string | null
          organization_id: string
          paper_size?: string | null
          print_qr_code?: boolean | null
          qr_code_data?: string | null
          show_logo?: boolean | null
          show_tax_details?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          font_size?: string | null
          footer_text?: string | null
          header_text?: string | null
          id?: string
          logo_url?: string | null
          organization_id?: string
          paper_size?: string | null
          print_qr_code?: boolean | null
          qr_code_data?: string | null
          show_logo?: boolean | null
          show_tax_details?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_config_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bill_config_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "bill_config_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cafe_floors: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          sort_order: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          sort_order?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          sort_order?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cafe_floors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cafe_floors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cafe_floors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cafe_tables: {
        Row: {
          capacity: number | null
          capacity_covers: number | null
          created_at: string
          current_order_id: string | null
          floor_id: string | null
          id: string
          is_active: boolean | null
          last_served_at: string | null
          merged_with_table_ids: string[] | null
          name: string
          notes: string | null
          organization_id: string
          qr_code_token: string | null
          sort_order: number | null
          status: string | null
          updated_at: string | null
          zone: string | null
        }
        Insert: {
          capacity?: number | null
          capacity_covers?: number | null
          created_at?: string
          current_order_id?: string | null
          floor_id?: string | null
          id?: string
          is_active?: boolean | null
          last_served_at?: string | null
          merged_with_table_ids?: string[] | null
          name: string
          notes?: string | null
          organization_id: string
          qr_code_token?: string | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
          zone?: string | null
        }
        Update: {
          capacity?: number | null
          capacity_covers?: number | null
          created_at?: string
          current_order_id?: string | null
          floor_id?: string | null
          id?: string
          is_active?: boolean | null
          last_served_at?: string | null
          merged_with_table_ids?: string[] | null
          name?: string
          notes?: string | null
          organization_id?: string
          qr_code_token?: string | null
          sort_order?: number | null
          status?: string | null
          updated_at?: string | null
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cafe_tables_current_order_id_fkey"
            columns: ["current_order_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cafe_tables_current_order_id_fkey"
            columns: ["current_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cafe_tables_floor_id_fkey"
            columns: ["floor_id"]
            isOneToOne: false
            referencedRelation: "cafe_floors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cafe_tables_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cafe_tables_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "cafe_tables_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          cgst_rate: number | null
          created_at: string | null
          deleted_at: string | null
          gst_rate: number | null
          icon: string | null
          id: string
          igst_rate: number | null
          is_active: string | null
          name: string
          organization_id: string
          parent_id: string | null
          sgst_rate: number | null
          tax_config: Json | null
          updated_at: string | null
        }
        Insert: {
          cgst_rate?: number | null
          created_at?: string | null
          deleted_at?: string | null
          gst_rate?: number | null
          icon?: string | null
          id?: string
          igst_rate?: number | null
          is_active?: string | null
          name: string
          organization_id: string
          parent_id?: string | null
          sgst_rate?: number | null
          tax_config?: Json | null
          updated_at?: string | null
        }
        Update: {
          cgst_rate?: number | null
          created_at?: string | null
          deleted_at?: string | null
          gst_rate?: number | null
          icon?: string | null
          id?: string
          igst_rate?: number | null
          is_active?: string | null
          name?: string
          organization_id?: string
          parent_id?: string | null
          sgst_rate?: number | null
          tax_config?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_products: {
        Row: {
          coupon_id: string
          created_at: string | null
          product_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string | null
          product_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_products_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "store_coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "coupon_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["product_id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          description: string | null
          id: string
          order_id: string | null
          organization_id: string
          party_id: string
          reference_number: string | null
          reminder_sent: boolean | null
          reminder_sent_at: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          order_id?: string | null
          organization_id: string
          party_id: string
          reference_number?: string | null
          reminder_sent?: boolean | null
          reminder_sent_at?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          order_id?: string | null
          organization_id?: string
          party_id?: string
          reference_number?: string | null
          reminder_sent?: boolean | null
          reminder_sent_at?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "credit_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "credit_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_transactions_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_transactions_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties_masked"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_addresses: {
        Row: {
          address: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          customer_id: string | null
          full_name: string | null
          id: string
          is_default: boolean | null
          label: string | null
          organization_id: string
          phone: string | null
          pincode: string | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          customer_id?: string | null
          full_name?: string | null
          id?: string
          is_default?: boolean | null
          label?: string | null
          organization_id: string
          phone?: string | null
          pincode?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          customer_id?: string | null
          full_name?: string | null
          id?: string
          is_default?: boolean | null
          label?: string | null
          organization_id?: string
          phone?: string | null
          pincode?: string | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "parties_masked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_addresses_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "customer_addresses_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "customer_addresses_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      debit_notes: {
        Row: {
          created_at: string | null
          debit_note_date: string | null
          debit_note_number: string
          description: string | null
          discrepancy_id: string | null
          id: string
          items: Json | null
          organization_id: string
          purchase_order_id: string
          reason: string
          settlement_date: string | null
          settlement_method: string | null
          settlement_reference: string | null
          status: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          debit_note_date?: string | null
          debit_note_number: string
          description?: string | null
          discrepancy_id?: string | null
          id?: string
          items?: Json | null
          organization_id: string
          purchase_order_id: string
          reason: string
          settlement_date?: string | null
          settlement_method?: string | null
          settlement_reference?: string | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          debit_note_date?: string | null
          debit_note_number?: string
          description?: string | null
          discrepancy_id?: string | null
          id?: string
          items?: Json | null
          organization_id?: string
          purchase_order_id?: string
          reason?: string
          settlement_date?: string | null
          settlement_method?: string | null
          settlement_reference?: string | null
          status?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debit_notes_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "debit_notes_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "debit_notes_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debit_notes_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debit_notes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debit_notes_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "parties_masked"
            referencedColumns: ["id"]
          },
        ]
      }
      delete_requests: {
        Row: {
          id: string
          organization_id: string
          party_id: string
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          requested_at: string | null
          status: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          party_id: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          requested_at?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          party_id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          requested_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delete_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "delete_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "delete_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delete_requests_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delete_requests_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties_masked"
            referencedColumns: ["id"]
          },
        ]
      }
      error_log: {
        Row: {
          context: Json | null
          created_at: string | null
          error_message: string
          error_stack: string | null
          error_type: string
          id: string
          organization_id: string | null
          resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string | null
          user_id: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string | null
          error_message: string
          error_stack?: string | null
          error_type: string
          id?: string
          organization_id?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          user_id?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string | null
          error_message?: string
          error_stack?: string | null
          error_type?: string
          id?: string
          organization_id?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      feature_permissions: {
        Row: {
          created_at: string
          feature_id: string
          permission_id: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          permission_id: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          permission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_permissions_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      features: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          name?: string
        }
        Relationships: []
      }
      goods_received_notes: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          organization_id: string
          purchase_order_id: string
          received_at: string | null
          received_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          purchase_order_id: string
          received_at?: string | null
          received_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          purchase_order_id?: string
          received_at?: string | null
          received_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goods_received_notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "goods_received_notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "goods_received_notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goods_received_notes_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      grn_items: {
        Row: {
          batch_id: string | null
          created_at: string | null
          grn_id: string
          id: string
          organization_id: string
          product_id: string
          quantity_ordered: number
          quantity_received: number
          unit_price: number | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          grn_id: string
          id?: string
          organization_id: string
          product_id: string
          quantity_ordered: number
          quantity_received: number
          unit_price?: number | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          grn_id?: string
          id?: string
          organization_id?: string
          product_id?: string
          quantity_ordered?: number
          quantity_received?: number
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grn_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grn_items_grn_id_fkey"
            columns: ["grn_id"]
            isOneToOne: false
            referencedRelation: "goods_received_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grn_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "grn_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "grn_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grn_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grn_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "grn_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["product_id"]
          },
        ]
      }
      held_sales: {
        Row: {
          cart: Json
          created_at: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          notes: string | null
          organization_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cart?: Json
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cart?: Json
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "held_sales_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "held_sales_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "held_sales_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      idempotency_keys: {
        Row: {
          created_at: string
          endpoint: string
          expires_at: string
          http_method: string
          id: string
          organization_id: string
          request_body: Json | null
          request_hash: string
          response_body: Json | null
          response_headers: Json | null
          response_status: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          expires_at?: string
          http_method: string
          id?: string
          organization_id: string
          request_body?: Json | null
          request_hash: string
          response_body?: Json | null
          response_headers?: Json | null
          response_status?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          expires_at?: string
          http_method?: string
          id?: string
          organization_id?: string
          request_body?: Json | null
          request_hash?: string
          response_body?: Json | null
          response_headers?: Json | null
          response_status?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      kitchen_order_items: {
        Row: {
          created_at: string | null
          id: string
          kitchen_order_id: string
          notes: string | null
          order_item_id: string
          organization_id: string
          quantity: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          kitchen_order_id: string
          notes?: string | null
          order_item_id: string
          organization_id: string
          quantity: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          kitchen_order_id?: string
          notes?: string | null
          order_item_id?: string
          organization_id?: string
          quantity?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kitchen_order_items_kitchen_order_id_fkey"
            columns: ["kitchen_order_id"]
            isOneToOne: false
            referencedRelation: "kitchen_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kitchen_order_items_kitchen_order_id_fkey"
            columns: ["kitchen_order_id"]
            isOneToOne: false
            referencedRelation: "view_kitchen_display_board"
            referencedColumns: ["kitchen_order_id"]
          },
          {
            foreignKeyName: "kitchen_order_items_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kitchen_order_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "kitchen_order_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "kitchen_order_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      kitchen_orders: {
        Row: {
          created_at: string
          id: string
          items: Json | null
          order_id: string | null
          organization_id: string
          status: string | null
          table_number: string | null
          token_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          items?: Json | null
          order_id?: string | null
          organization_id: string
          status?: string | null
          table_number?: string | null
          token_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json | null
          order_id?: string | null
          organization_id?: string
          status?: string | null
          table_number?: string | null
          token_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kitchen_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kitchen_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      language_templates: {
        Row: {
          created_at: string | null
          id: string
          language_code: string
          organization_id: string
          store_address: string | null
          store_name: string | null
          template_key: string
          template_value: string
          translations: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language_code: string
          organization_id: string
          store_address?: string | null
          store_name?: string | null
          template_key: string
          template_value: string
          translations?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language_code?: string
          organization_id?: string
          store_address?: string | null
          store_name?: string | null
          template_key?: string
          template_value?: string
          translations?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "language_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "language_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "language_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_config: {
        Row: {
          birthday_bonus: number | null
          gold_threshold: number | null
          is_enabled: boolean | null
          max_redeem_percent: number | null
          min_redeem_points: number | null
          organization_id: string
          platinum_threshold: number | null
          point_value_rupees: number | null
          points_per_100: number | null
          signup_bonus: number | null
          silver_threshold: number | null
          updated_at: string | null
        }
        Insert: {
          birthday_bonus?: number | null
          gold_threshold?: number | null
          is_enabled?: boolean | null
          max_redeem_percent?: number | null
          min_redeem_points?: number | null
          organization_id: string
          platinum_threshold?: number | null
          point_value_rupees?: number | null
          points_per_100?: number | null
          signup_bonus?: number | null
          silver_threshold?: number | null
          updated_at?: string | null
        }
        Update: {
          birthday_bonus?: number | null
          gold_threshold?: number | null
          is_enabled?: boolean | null
          max_redeem_percent?: number | null
          min_redeem_points?: number | null
          organization_id?: string
          platinum_threshold?: number | null
          point_value_rupees?: number | null
          points_per_100?: number | null
          signup_bonus?: number | null
          silver_threshold?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_config_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "loyalty_config_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "loyalty_config_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_transactions: {
        Row: {
          balance_after: number
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          invoice_id: string | null
          organization_id: string
          party_id: string
          points: number
          type: string
        }
        Insert: {
          balance_after: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          invoice_id?: string | null
          organization_id: string
          party_id: string
          points: number
          type: string
        }
        Update: {
          balance_after?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          invoice_id?: string | null
          organization_id?: string
          party_id?: string
          points?: number
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "loyalty_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "loyalty_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loyalty_transactions_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties_masked"
            referencedColumns: ["id"]
          },
        ]
      }
      message_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          message_type: string
          metadata: Json | null
          organization_id: string
          provider: string
          recipient: string
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          message_type: string
          metadata?: Json | null
          organization_id: string
          provider: string
          recipient: string
          status?: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          organization_id?: string
          provider?: string
          recipient?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "message_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "message_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          organization_id: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          organization_id: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          organization_id?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "notifications_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "notifications_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      online_store_products: {
        Row: {
          coupon_code: string | null
          coupon_type: string | null
          coupon_value: number | null
          created_at: string | null
          delivery_charge: number | null
          id: string
          is_deal_of_the_day: boolean | null
          is_trending: boolean | null
          is_visible: boolean | null
          online_description_override: string | null
          online_price: number | null
          organization_id: string | null
          product_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          coupon_code?: string | null
          coupon_type?: string | null
          coupon_value?: number | null
          created_at?: string | null
          delivery_charge?: number | null
          id?: string
          is_deal_of_the_day?: boolean | null
          is_trending?: boolean | null
          is_visible?: boolean | null
          online_description_override?: string | null
          online_price?: number | null
          organization_id?: string | null
          product_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          coupon_code?: string | null
          coupon_type?: string | null
          coupon_value?: number | null
          created_at?: string | null
          delivery_charge?: number | null
          id?: string
          is_deal_of_the_day?: boolean | null
          is_trending?: boolean | null
          is_visible?: boolean | null
          online_description_override?: string | null
          online_price?: number | null
          organization_id?: string | null
          product_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "online_store_products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "online_store_products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "online_store_products_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "online_store_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "online_store_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "view_inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "online_store_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["product_id"]
          },
        ]
      }
      order_items: {
        Row: {
          batch_id: string | null
          created_at: string | null
          description: string | null
          discount_amount: number | null
          gst_amount: number | null
          gst_rate: number | null
          hsn: string | null
          id: string
          is_returned: boolean | null
          metadata: Json | null
          mrp: number | null
          name: string | null
          name_secondary: string | null
          order_id: string
          organization_id: string
          product_id: string | null
          product_name: string
          quantity: number
          serial_number: string | null
          subtotal: number | null
          tax_amount: number | null
          tax_rate: number | null
          total_price: number
          unit_price: number
          variant_id: string | null
          warranty_info: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          gst_amount?: number | null
          gst_rate?: number | null
          hsn?: string | null
          id?: string
          is_returned?: boolean | null
          metadata?: Json | null
          mrp?: number | null
          name?: string | null
          name_secondary?: string | null
          order_id: string
          organization_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          serial_number?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          total_price: number
          unit_price: number
          variant_id?: string | null
          warranty_info?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          gst_amount?: number | null
          gst_rate?: number | null
          hsn?: string | null
          id?: string
          is_returned?: boolean | null
          metadata?: Json | null
          mrp?: number | null
          name?: string | null
          name_secondary?: string | null
          order_id?: string
          organization_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          serial_number?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          tax_rate?: number | null
          total_price?: number
          unit_price?: number
          variant_id?: string | null
          warranty_info?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "order_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "order_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["product_id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_date: string | null
          change_amount: number | null
          coupon_code: string | null
          coupon_discount: number | null
          created_at: string | null
          created_by: string | null
          customer_address: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          delivery_address: string | null
          delivery_charge: number | null
          delivery_info: Json | null
          delivery_slot: string | null
          delivery_status: string | null
          delivery_type: string | null
          guest_count: number | null
          id: string
          idempotency_key: string | null
          invoice_number: string
          invoice_sequence: number | null
          invoice_type: string | null
          is_cancelled: boolean | null
          is_synced: boolean | null
          merchant_address_at_sale: string | null
          merchant_gstin_at_sale: string | null
          merchant_name_at_sale: string | null
          notes: string | null
          organization_id: string
          origin: string | null
          packing_charge: number | null
          party_id: string | null
          payment_details: Json | null
          payment_link: string | null
          payment_method: string | null
          payment_status: string | null
          place_of_supply: string | null
          received_amount: number | null
          source: string | null
          subtotal: number | null
          table_number: string | null
          tax_amount: number | null
          tax_details: Json | null
          tip_amount: number | null
          token_id: string | null
          token_number: number | null
          total_amount: number
          total_discount: number | null
          total_tax: number | null
          type: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          billing_date?: string | null
          change_amount?: number | null
          coupon_code?: string | null
          coupon_discount?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_charge?: number | null
          delivery_info?: Json | null
          delivery_slot?: string | null
          delivery_status?: string | null
          delivery_type?: string | null
          guest_count?: number | null
          id?: string
          idempotency_key?: string | null
          invoice_number: string
          invoice_sequence?: number | null
          invoice_type?: string | null
          is_cancelled?: boolean | null
          is_synced?: boolean | null
          merchant_address_at_sale?: string | null
          merchant_gstin_at_sale?: string | null
          merchant_name_at_sale?: string | null
          notes?: string | null
          organization_id: string
          origin?: string | null
          packing_charge?: number | null
          party_id?: string | null
          payment_details?: Json | null
          payment_link?: string | null
          payment_method?: string | null
          payment_status?: string | null
          place_of_supply?: string | null
          received_amount?: number | null
          source?: string | null
          subtotal?: number | null
          table_number?: string | null
          tax_amount?: number | null
          tax_details?: Json | null
          tip_amount?: number | null
          token_id?: string | null
          token_number?: number | null
          total_amount?: number
          total_discount?: number | null
          total_tax?: number | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          billing_date?: string | null
          change_amount?: number | null
          coupon_code?: string | null
          coupon_discount?: number | null
          created_at?: string | null
          created_by?: string | null
          customer_address?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          delivery_address?: string | null
          delivery_charge?: number | null
          delivery_info?: Json | null
          delivery_slot?: string | null
          delivery_status?: string | null
          delivery_type?: string | null
          guest_count?: number | null
          id?: string
          idempotency_key?: string | null
          invoice_number?: string
          invoice_sequence?: number | null
          invoice_type?: string | null
          is_cancelled?: boolean | null
          is_synced?: boolean | null
          merchant_address_at_sale?: string | null
          merchant_gstin_at_sale?: string | null
          merchant_name_at_sale?: string | null
          notes?: string | null
          organization_id?: string
          origin?: string | null
          packing_charge?: number | null
          party_id?: string | null
          payment_details?: Json | null
          payment_link?: string | null
          payment_method?: string | null
          payment_status?: string | null
          place_of_supply?: string | null
          received_amount?: number | null
          source?: string | null
          subtotal?: number | null
          table_number?: string | null
          tax_amount?: number | null
          tax_details?: Json | null
          tip_amount?: number | null
          token_id?: string | null
          token_number?: number | null
          total_amount?: number
          total_discount?: number | null
          total_tax?: number | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties_masked"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          access_end_time: string | null
          access_start_time: string | null
          allowed_routes: Json | null
          avatar_url: string | null
          created_at: string | null
          department: string | null
          display_name: string | null
          full_name: string | null
          is_active: boolean | null
          joining_date: string | null
          last_activity: string | null
          member_display_id: string | null
          organization_id: string
          phone: string | null
          role: string | null
          role_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_end_time?: string | null
          access_start_time?: string | null
          allowed_routes?: Json | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          display_name?: string | null
          full_name?: string | null
          is_active?: boolean | null
          joining_date?: string | null
          last_activity?: string | null
          member_display_id?: string | null
          organization_id: string
          phone?: string | null
          role?: string | null
          role_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_end_time?: string | null
          access_start_time?: string | null
          allowed_routes?: Json | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          display_name?: string | null
          full_name?: string | null
          is_active?: boolean | null
          joining_date?: string | null
          last_activity?: string | null
          member_display_id?: string | null
          organization_id?: string
          phone?: string | null
          role?: string | null
          role_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_sequences: {
        Row: {
          last_reset_date: string | null
          last_value: number | null
          organization_id: string
          sequence_type: string
          updated_at: string | null
        }
        Insert: {
          last_reset_date?: string | null
          last_value?: number | null
          organization_id: string
          sequence_type: string
          updated_at?: string | null
        }
        Update: {
          last_reset_date?: string | null
          last_value?: number | null
          organization_id?: string
          sequence_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_sequences_org_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_sequences_org_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_sequences_org_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_settings: {
        Row: {
          active_theme_version_id: string | null
          created_at: string | null
          currency: string | null
          logo_url: string | null
          navbar_config: Json | null
          notification_config: Json | null
          organization_id: string
          payment_config: Json | null
          pos_config: Json | null
          primary_color: string | null
          secondary_color: string | null
          show_launchpad: boolean | null
          store_config: Json | null
          store_domain: string | null
          store_enabled: boolean | null
          store_name: string | null
          theme_config: Json | null
          theme_id: string | null
          timezone: string | null
          trending_text: string | null
          updated_at: string | null
        }
        Insert: {
          active_theme_version_id?: string | null
          created_at?: string | null
          currency?: string | null
          logo_url?: string | null
          navbar_config?: Json | null
          notification_config?: Json | null
          organization_id: string
          payment_config?: Json | null
          pos_config?: Json | null
          primary_color?: string | null
          secondary_color?: string | null
          show_launchpad?: boolean | null
          store_config?: Json | null
          store_domain?: string | null
          store_enabled?: boolean | null
          store_name?: string | null
          theme_config?: Json | null
          theme_id?: string | null
          timezone?: string | null
          trending_text?: string | null
          updated_at?: string | null
        }
        Update: {
          active_theme_version_id?: string | null
          created_at?: string | null
          currency?: string | null
          logo_url?: string | null
          navbar_config?: Json | null
          notification_config?: Json | null
          organization_id?: string
          payment_config?: Json | null
          pos_config?: Json | null
          primary_color?: string | null
          secondary_color?: string | null
          show_launchpad?: boolean | null
          store_config?: Json | null
          store_domain?: string | null
          store_enabled?: boolean | null
          store_name?: string | null
          theme_config?: Json | null
          theme_id?: string | null
          timezone?: string | null
          trending_text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_settings_active_theme_version_id_fkey"
            columns: ["active_theme_version_id"]
            isOneToOne: false
            referencedRelation: "theme_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_usage: {
        Row: {
          accrued_commission: number
          active_device_count: number | null
          category_count: number | null
          customer_count: number | null
          daily_credit_tx_count: number | null
          last_daily_reset: string | null
          last_monthly_reset: string | null
          last_monthly_reset_date: string | null
          monthly_credit_tx_count: number | null
          monthly_invoice_count: number | null
          monthly_po_count: number | null
          organization_id: string
          product_count: number | null
          quota_status: string | null
          staff_count: number | null
          storage_used_mb: number | null
          total_revenue_contribution: number
          tv_banner_count: number | null
          updated_at: string | null
          vendor_count: number | null
        }
        Insert: {
          accrued_commission?: number
          active_device_count?: number | null
          category_count?: number | null
          customer_count?: number | null
          daily_credit_tx_count?: number | null
          last_daily_reset?: string | null
          last_monthly_reset?: string | null
          last_monthly_reset_date?: string | null
          monthly_credit_tx_count?: number | null
          monthly_invoice_count?: number | null
          monthly_po_count?: number | null
          organization_id: string
          product_count?: number | null
          quota_status?: string | null
          staff_count?: number | null
          storage_used_mb?: number | null
          total_revenue_contribution?: number
          tv_banner_count?: number | null
          updated_at?: string | null
          vendor_count?: number | null
        }
        Update: {
          accrued_commission?: number
          active_device_count?: number | null
          category_count?: number | null
          customer_count?: number | null
          daily_credit_tx_count?: number | null
          last_daily_reset?: string | null
          last_monthly_reset?: string | null
          last_monthly_reset_date?: string | null
          monthly_credit_tx_count?: number | null
          monthly_invoice_count?: number | null
          monthly_po_count?: number | null
          organization_id?: string
          product_count?: number | null
          quota_status?: string | null
          staff_count?: number | null
          storage_used_mb?: number | null
          total_revenue_contribution?: number
          tv_banner_count?: number | null
          updated_at?: string | null
          vendor_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_usage_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_usage_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_usage_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          building_name: string | null
          business_address: string | null
          business_hours: string | null
          business_phone: string | null
          business_type: string | null
          city: string | null
          country: string | null
          created_at: string
          custom_domain: string | null
          description: string | null
          display_id: string | null
          domain_verification_token: string | null
          email: string | null
          established_year: number | null
          gst_number: string | null
          history_info: string | null
          id: string
          indiamart_url: string | null
          instagram_url: string | null
          invited_by_partner_id: string | null
          landmark: string | null
          linkedin_url: string | null
          mission_statement: string | null
          name: string
          online_description: string | null
          owner_id: string
          partner_id: string | null
          pincode: string | null
          quality_first: string | null
          slogan: string | null
          slug: string | null
          social_feed_embed: string | null
          state: string | null
          street: string | null
          tax_identifier: string | null
          updated_at: string | null
          vision_statement: string | null
          website: string | null
          whatsapp_number: string | null
        }
        Insert: {
          building_name?: string | null
          business_address?: string | null
          business_hours?: string | null
          business_phone?: string | null
          business_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          custom_domain?: string | null
          description?: string | null
          display_id?: string | null
          domain_verification_token?: string | null
          email?: string | null
          established_year?: number | null
          gst_number?: string | null
          history_info?: string | null
          id?: string
          indiamart_url?: string | null
          instagram_url?: string | null
          invited_by_partner_id?: string | null
          landmark?: string | null
          linkedin_url?: string | null
          mission_statement?: string | null
          name: string
          online_description?: string | null
          owner_id: string
          partner_id?: string | null
          pincode?: string | null
          quality_first?: string | null
          slogan?: string | null
          slug?: string | null
          social_feed_embed?: string | null
          state?: string | null
          street?: string | null
          tax_identifier?: string | null
          updated_at?: string | null
          vision_statement?: string | null
          website?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          building_name?: string | null
          business_address?: string | null
          business_hours?: string | null
          business_phone?: string | null
          business_type?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          custom_domain?: string | null
          description?: string | null
          display_id?: string | null
          domain_verification_token?: string | null
          email?: string | null
          established_year?: number | null
          gst_number?: string | null
          history_info?: string | null
          id?: string
          indiamart_url?: string | null
          instagram_url?: string | null
          invited_by_partner_id?: string | null
          landmark?: string | null
          linkedin_url?: string | null
          mission_statement?: string | null
          name?: string
          online_description?: string | null
          owner_id?: string
          partner_id?: string | null
          pincode?: string | null
          quality_first?: string | null
          slogan?: string | null
          slug?: string | null
          social_feed_embed?: string | null
          state?: string | null
          street?: string | null
          tax_identifier?: string | null
          updated_at?: string | null
          vision_statement?: string | null
          website?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "vw_partner_financial_overview"
            referencedColumns: ["partner_id"]
          },
        ]
      }
      parties: {
        Row: {
          aadhar_number_encrypted: string | null
          address: string | null
          auth_id: string | null
          balance: number | null
          bank_account_encrypted: string | null
          billing_address: Json | null
          created_at: string | null
          created_by: string | null
          credit_limit: number | null
          credit_limit_enabled: boolean | null
          data_processing_consent: boolean | null
          data_processing_consent_date: string | null
          deleted_at: string | null
          display_id: string | null
          due_date: string | null
          email: string | null
          email_opt_in: boolean | null
          gst_number: string | null
          id: string
          ifsc_code_encrypted: string | null
          last_reminder_sent_at: string | null
          ledger_balance: number
          loyalty_points: number | null
          loyalty_tier: string | null
          marketing_consent: boolean | null
          marketing_consent_date: string | null
          metadata: Json | null
          mobile: string | null
          name: string
          notes: string | null
          notifications_enabled: boolean | null
          organization_id: string
          pan_number_encrypted: string | null
          party_type: string | null
          phone: string | null
          reminder_count: number | null
          shipping_address: Json | null
          sms_opt_in: boolean | null
          total_points_earned: number | null
          total_points_redeemed: number | null
          type: string | null
          updated_at: string | null
          user_id: string | null
          wallet_balance: number | null
          whatsapp_opt_in: boolean | null
        }
        Insert: {
          aadhar_number_encrypted?: string | null
          address?: string | null
          auth_id?: string | null
          balance?: number | null
          bank_account_encrypted?: string | null
          billing_address?: Json | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          credit_limit_enabled?: boolean | null
          data_processing_consent?: boolean | null
          data_processing_consent_date?: string | null
          deleted_at?: string | null
          display_id?: string | null
          due_date?: string | null
          email?: string | null
          email_opt_in?: boolean | null
          gst_number?: string | null
          id?: string
          ifsc_code_encrypted?: string | null
          last_reminder_sent_at?: string | null
          ledger_balance?: number
          loyalty_points?: number | null
          loyalty_tier?: string | null
          marketing_consent?: boolean | null
          marketing_consent_date?: string | null
          metadata?: Json | null
          mobile?: string | null
          name: string
          notes?: string | null
          notifications_enabled?: boolean | null
          organization_id: string
          pan_number_encrypted?: string | null
          party_type?: string | null
          phone?: string | null
          reminder_count?: number | null
          shipping_address?: Json | null
          sms_opt_in?: boolean | null
          total_points_earned?: number | null
          total_points_redeemed?: number | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_balance?: number | null
          whatsapp_opt_in?: boolean | null
        }
        Update: {
          aadhar_number_encrypted?: string | null
          address?: string | null
          auth_id?: string | null
          balance?: number | null
          bank_account_encrypted?: string | null
          billing_address?: Json | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          credit_limit_enabled?: boolean | null
          data_processing_consent?: boolean | null
          data_processing_consent_date?: string | null
          deleted_at?: string | null
          display_id?: string | null
          due_date?: string | null
          email?: string | null
          email_opt_in?: boolean | null
          gst_number?: string | null
          id?: string
          ifsc_code_encrypted?: string | null
          last_reminder_sent_at?: string | null
          ledger_balance?: number
          loyalty_points?: number | null
          loyalty_tier?: string | null
          marketing_consent?: boolean | null
          marketing_consent_date?: string | null
          metadata?: Json | null
          mobile?: string | null
          name?: string
          notes?: string | null
          notifications_enabled?: boolean | null
          organization_id?: string
          pan_number_encrypted?: string | null
          party_type?: string | null
          phone?: string | null
          reminder_count?: number | null
          shipping_address?: Json | null
          sms_opt_in?: boolean | null
          total_points_earned?: number | null
          total_points_redeemed?: number | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_balance?: number | null
          whatsapp_opt_in?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "parties_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "parties_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "parties_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_bank_details: {
        Row: {
          account_holder_name: string | null
          account_number: string | null
          bank_name: string | null
          created_at: string
          id: string
          ifsc_code: string | null
          is_verified: boolean
          partner_id: string
          updated_at: string
          upi_id: string | null
        }
        Insert: {
          account_holder_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string | null
          is_verified?: boolean
          partner_id: string
          updated_at?: string
          upi_id?: string | null
        }
        Update: {
          account_holder_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string | null
          is_verified?: boolean
          partner_id?: string
          updated_at?: string
          upi_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_bank_details_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: true
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_bank_details_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: true
            referencedRelation: "vw_partner_financial_overview"
            referencedColumns: ["partner_id"]
          },
        ]
      }
      partner_commission_rules: {
        Row: {
          base_rate: number
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          tiers: Json | null
          type: string
        }
        Insert: {
          base_rate?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          tiers?: Json | null
          type?: string
        }
        Update: {
          base_rate?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          tiers?: Json | null
          type?: string
        }
        Relationships: []
      }
      partner_commissions: {
        Row: {
          amount: number
          commission_rate: number
          created_at: string
          id: string
          metadata: Json | null
          organization_id: string
          partner_id: string
          settlement_id: string | null
          status: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          organization_id: string
          partner_id: string
          settlement_id?: string | null
          status?: string
          subscription_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          organization_id?: string
          partner_id?: string
          settlement_id?: string | null
          status?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_commissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "partner_commissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "partner_commissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "vw_partner_financial_overview"
            referencedColumns: ["partner_id"]
          },
          {
            foreignKeyName: "partner_commissions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_details: {
        Row: {
          aadhar_number: string | null
          address: string | null
          bank_account_no: string | null
          bank_name: string | null
          commission_rule_id: string | null
          created_at: string | null
          display_id: string | null
          gst_number: string | null
          id: string
          ifsc_code: string | null
          kyc_documents: Json | null
          kyc_status: string | null
          pan_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aadhar_number?: string | null
          address?: string | null
          bank_account_no?: string | null
          bank_name?: string | null
          commission_rule_id?: string | null
          created_at?: string | null
          display_id?: string | null
          gst_number?: string | null
          id?: string
          ifsc_code?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
          pan_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aadhar_number?: string | null
          address?: string | null
          bank_account_no?: string | null
          bank_name?: string | null
          commission_rule_id?: string | null
          created_at?: string | null
          display_id?: string | null
          gst_number?: string | null
          id?: string
          ifsc_code?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
          pan_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_details_commission_rule_id_fkey"
            columns: ["commission_rule_id"]
            isOneToOne: false
            referencedRelation: "partner_commission_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_payouts: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          partner_user_id: string
          payout_date: string | null
          period_end: string | null
          period_start: string | null
          reference_id: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          partner_user_id: string
          payout_date?: string | null
          period_end?: string | null
          period_start?: string | null
          reference_id?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          partner_user_id?: string
          payout_date?: string | null
          period_end?: string | null
          period_start?: string | null
          reference_id?: string | null
          status?: string | null
        }
        Relationships: []
      }
      partner_settlements: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          notes: string | null
          partner_id: string
          period_end: string
          period_start: string
          processed_at: string | null
          status: string
          transaction_reference: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          partner_id: string
          period_end?: string
          period_start?: string
          processed_at?: string | null
          status?: string
          transaction_reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          notes?: string | null
          partner_id?: string
          period_end?: string
          period_start?: string
          processed_at?: string | null
          status?: string
          transaction_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_settlements_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_settlements_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "vw_partner_financial_overview"
            referencedColumns: ["partner_id"]
          },
        ]
      }
      partner_withdrawal_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string
          id: string
          partner_id: string
          payout_method: string | null
          processed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string
          id?: string
          partner_id: string
          payout_method?: string | null
          processed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string
          id?: string
          partner_id?: string
          payout_method?: string | null
          processed_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_withdrawal_requests_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_withdrawal_requests_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "vw_partner_financial_overview"
            referencedColumns: ["partner_id"]
          },
        ]
      }
      partners: {
        Row: {
          commission_rate: number
          created_at: string
          id: string
          name: string
          referral_code: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          id?: string
          name: string
          referral_code?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          id?: string
          name?: string
          referral_code?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_allocations: {
        Row: {
          allocated_amount: number
          allocation_type: string
          created_at: string
          created_by: string
          id: string
          notes: string | null
          order_id: string
          organization_id: string
          payment_id: string
        }
        Insert: {
          allocated_amount: number
          allocation_type?: string
          created_at?: string
          created_by: string
          id?: string
          notes?: string | null
          order_id: string
          organization_id: string
          payment_id: string
        }
        Update: {
          allocated_amount?: number
          allocation_type?: string
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          order_id?: string
          organization_id?: string
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_allocations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_allocations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_allocations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "payment_allocations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "payment_allocations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_allocations_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_attempts: {
        Row: {
          amount_cents: number
          coupon_code: string | null
          coupon_discount_cents: number | null
          created_at: string | null
          duration_years: number | null
          gateway_order_id: string | null
          id: string
          metadata: Json | null
          organization_id: string | null
          plan_id: string
          status: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          coupon_code?: string | null
          coupon_discount_cents?: number | null
          created_at?: string | null
          duration_years?: number | null
          gateway_order_id?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          plan_id: string
          status?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          coupon_code?: string | null
          coupon_discount_cents?: number | null
          created_at?: string | null
          duration_years?: number | null
          gateway_order_id?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string | null
          plan_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_attempts_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_refunds: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          created_by: string
          failed_at: string | null
          failure_code: string | null
          failure_message: string | null
          gateway_refund_id: string | null
          gateway_response: Json | null
          id: string
          idempotency_key: string
          order_id: string
          organization_id: string
          payment_id: string
          reason: string
          refund_id: string
          status: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          created_by: string
          failed_at?: string | null
          failure_code?: string | null
          failure_message?: string | null
          gateway_refund_id?: string | null
          gateway_response?: Json | null
          id?: string
          idempotency_key: string
          order_id: string
          organization_id: string
          payment_id: string
          reason: string
          refund_id: string
          status?: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          created_by?: string
          failed_at?: string | null
          failure_code?: string | null
          failure_message?: string | null
          gateway_refund_id?: string | null
          gateway_response?: Json | null
          id?: string
          idempotency_key?: string
          order_id?: string
          organization_id?: string
          payment_id?: string
          reason?: string
          refund_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_refunds_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_refunds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "payment_refunds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "payment_refunds_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          id: string
          idempotency_key: string | null
          metadata: Json | null
          method: string | null
          order_id: string | null
          organization_id: string
          payment_date: string | null
          payment_flow: string | null
          payment_method: string | null
          reference_id: string
          reference_type: string
          settlement_batch_id: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          method?: string | null
          order_id?: string | null
          organization_id: string
          payment_date?: string | null
          payment_flow?: string | null
          payment_method?: string | null
          reference_id: string
          reference_type?: string
          settlement_batch_id?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          method?: string | null
          order_id?: string | null
          organization_id?: string
          payment_date?: string | null
          payment_flow?: string | null
          payment_method?: string | null
          reference_id?: string
          reference_type?: string
          settlement_batch_id?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_settlement_batch_id_fkey"
            columns: ["settlement_batch_id"]
            isOneToOne: false
            referencedRelation: "settlement_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unified_payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "unified_payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "unified_payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          key: string
          label: string
          module: string
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          key: string
          label: string
          module: string
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          key?: string
          label?: string
          module?: string
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "permissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "permissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "permissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_apps: {
        Row: {
          app_id: string
          created_at: string | null
          plan_id: string
        }
        Insert: {
          app_id: string
          created_at?: string | null
          plan_id: string
        }
        Update: {
          app_id?: string
          created_at?: string | null
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_apps_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_apps_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_coupons: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          plan_id: string | null
          times_used: number | null
          type: string | null
          updated_at: string | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          plan_id?: string | null
          times_used?: number | null
          type?: string | null
          updated_at?: string | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          plan_id?: string | null
          times_used?: number | null
          type?: string | null
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_coupons_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_features: {
        Row: {
          created_at: string
          feature_id: string
          plan_id: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          plan_id: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "features"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_features_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_routes: {
        Row: {
          created_at: string
          plan_id: string
          route_key: string
        }
        Insert: {
          created_at?: string
          plan_id: string
          route_key: string
        }
        Update: {
          created_at?: string
          plan_id?: string
          route_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_routes_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          applicable_coupons: string[] | null
          created_at: string | null
          description: string | null
          discount_price: number | null
          features_json: Json | null
          id: string
          interval: string
          is_active: boolean
          is_featured: boolean | null
          level: number
          limits_json: Json | null
          max_members: number | null
          mrp_cents: number | null
          name: string
          price: number | null
          price_cents: number
          routes: string[] | null
          slug: string
          trial_days: number
          updated_at: string | null
        }
        Insert: {
          applicable_coupons?: string[] | null
          created_at?: string | null
          description?: string | null
          discount_price?: number | null
          features_json?: Json | null
          id?: string
          interval?: string
          is_active?: boolean
          is_featured?: boolean | null
          level?: number
          limits_json?: Json | null
          max_members?: number | null
          mrp_cents?: number | null
          name: string
          price?: number | null
          price_cents?: number
          routes?: string[] | null
          slug: string
          trial_days?: number
          updated_at?: string | null
        }
        Update: {
          applicable_coupons?: string[] | null
          created_at?: string | null
          description?: string | null
          discount_price?: number | null
          features_json?: Json | null
          id?: string
          interval?: string
          is_active?: boolean
          is_featured?: boolean | null
          level?: number
          limits_json?: Json | null
          max_members?: number | null
          mrp_cents?: number | null
          name?: string
          price?: number | null
          price_cents?: number
          routes?: string[] | null
          slug?: string
          trial_days?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_broadcasts: {
        Row: {
          broadcast_type: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          link: string | null
          message: string
          notification_count: number | null
          target_audience: string | null
          title: string
        }
        Insert: {
          broadcast_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          link?: string | null
          message: string
          notification_count?: number | null
          target_audience?: string | null
          title: string
        }
        Update: {
          broadcast_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          link?: string | null
          message?: string
          notification_count?: number | null
          target_audience?: string | null
          title?: string
        }
        Relationships: []
      }
      pos_audit_log: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          organization_id: string
          resource_id: string | null
          resource_type: string
          user_id: string
          user_name: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          organization_id: string
          resource_id?: string | null
          resource_type: string
          user_id: string
          user_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          organization_id?: string
          resource_id?: string | null
          resource_type?: string
          user_id?: string
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pos_audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "pos_audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "pos_audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_contributions: {
        Row: {
          admin_notes: string | null
          barcode: string | null
          category: string | null
          created_at: string | null
          dictionary_entry_id: number | null
          gst_rate: number | null
          hsn_code: string | null
          id: string
          image_url: string | null
          organization_id: string
          product_name: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          barcode?: string | null
          category?: string | null
          created_at?: string | null
          dictionary_entry_id?: number | null
          gst_rate?: number | null
          hsn_code?: string | null
          id?: string
          image_url?: string | null
          organization_id: string
          product_name: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          barcode?: string | null
          category?: string | null
          created_at?: string | null
          dictionary_entry_id?: number | null
          gst_rate?: number | null
          hsn_code?: string | null
          id?: string
          image_url?: string | null
          organization_id?: string
          product_name?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_contributions_dictionary_entry_id_fkey"
            columns: ["dictionary_entry_id"]
            isOneToOne: false
            referencedRelation: "product_dictionary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_contributions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_contributions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_contributions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_dictionary: {
        Row: {
          approved_by: string | null
          ar: string | null
          as: string | null
          barcode: string | null
          bn: string | null
          brand: string | null
          category: string | null
          contributed_by: string | null
          contributed_org: string | null
          contribution_status: string | null
          created_at: string
          default_image: string | null
          description: string | null
          en: string
          gallery_images: Json | null
          gst_rate: number | null
          gu: string | null
          hi: string | null
          hsn_code: string | null
          id: number
          kn: string | null
          ml: string | null
          mr: string | null
          or: string | null
          pa: string | null
          source: string
          status: string
          sub_category: string | null
          suggested_price: number | null
          ta: string | null
          te: string | null
          unit: string | null
          updated_at: string
          ur: string | null
          weight: string | null
        }
        Insert: {
          approved_by?: string | null
          ar?: string | null
          as?: string | null
          barcode?: string | null
          bn?: string | null
          brand?: string | null
          category?: string | null
          contributed_by?: string | null
          contributed_org?: string | null
          contribution_status?: string | null
          created_at?: string
          default_image?: string | null
          description?: string | null
          en: string
          gallery_images?: Json | null
          gst_rate?: number | null
          gu?: string | null
          hi?: string | null
          hsn_code?: string | null
          id?: never
          kn?: string | null
          ml?: string | null
          mr?: string | null
          or?: string | null
          pa?: string | null
          source: string
          status: string
          sub_category?: string | null
          suggested_price?: number | null
          ta?: string | null
          te?: string | null
          unit?: string | null
          updated_at?: string
          ur?: string | null
          weight?: string | null
        }
        Update: {
          approved_by?: string | null
          ar?: string | null
          as?: string | null
          barcode?: string | null
          bn?: string | null
          brand?: string | null
          category?: string | null
          contributed_by?: string | null
          contributed_org?: string | null
          contribution_status?: string | null
          created_at?: string
          default_image?: string | null
          description?: string | null
          en?: string
          gallery_images?: Json | null
          gst_rate?: number | null
          gu?: string | null
          hi?: string | null
          hsn_code?: string | null
          id?: never
          kn?: string | null
          ml?: string | null
          mr?: string | null
          or?: string | null
          pa?: string | null
          source?: string
          status?: string
          sub_category?: string | null
          suggested_price?: number | null
          ta?: string | null
          te?: string | null
          unit?: string | null
          updated_at?: string
          ur?: string | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_dictionary_contributed_org_fkey"
            columns: ["contributed_org"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_dictionary_contributed_org_fkey"
            columns: ["contributed_org"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_dictionary_contributed_org_fkey"
            columns: ["contributed_org"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_prices: {
        Row: {
          created_at: string | null
          id: string
          organization_id: string
          price_type: Database["public"]["Enums"]["price_tier_type"]
          product_id: string
          selling_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          organization_id: string
          price_type?: Database["public"]["Enums"]["price_tier_type"]
          product_id: string
          selling_price?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          organization_id?: string
          price_type?: Database["public"]["Enums"]["price_tier_type"]
          product_id?: string
          selling_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_prices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_prices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_prices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_prices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_requests: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          id: string
          notes: string | null
          organization_id: string | null
          product_name: string
          request_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          product_name: string
          request_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          product_name?: string
          request_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          customer_id: string | null
          customer_name: string
          id: string
          is_approved: boolean | null
          merchant_reply: string | null
          organization_id: string
          product_id: string | null
          rating: number
          replied_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_name: string
          id?: string
          is_approved?: boolean | null
          merchant_reply?: string | null
          organization_id: string
          product_id?: string | null
          rating: number
          replied_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string
          id?: string
          is_approved?: boolean | null
          merchant_reply?: string | null
          organization_id?: string
          product_id?: string | null
          rating?: number
          replied_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_reviews_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_reviews_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string | null
          id: string
          name: string
          organization_id: string
          price_override: number | null
          product_id: string
          sku: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          organization_id: string
          price_override?: number | null
          product_id: string
          sku?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          organization_id?: string
          price_override?: number | null
          product_id?: string
          sku?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_variants_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "product_variants_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["product_id"]
          },
        ]
      }
      products: {
        Row: {
          allow_partial_payment: boolean | null
          apply_discount_on: string | null
          barcode: string
          batch_id: string | null
          category_id: string | null
          cgst_rate: number | null
          created_at: string
          deleted_at: string | null
          delivery_charge: number | null
          description: string | null
          dietary_preference: string | null
          discount_type: string | null
          discount_value: number | null
          expiry_date: string | null
          featured_products: boolean | null
          gst_rate: number | null
          has_variants: boolean | null
          hsn: string | null
          id: string
          igst_rate: number | null
          image_url: string | null
          images: Json | null
          is_active: boolean | null
          is_inventory_tracked: boolean | null
          is_pos_visible: boolean | null
          is_visible_online: boolean | null
          item_type: Database["public"]["Enums"]["item_type_enum"] | null
          location: string | null
          low_stock_threshold: number | null
          metadata: Json | null
          mfg_date: string | null
          mrp: number | null
          name: string
          name_secondary: string | null
          online_description: string | null
          online_price: number | null
          organization_id: string
          partial_payment_amount: number | null
          purchase_price: number | null
          required_fields: Json | null
          selling_price: number | null
          serial_number: string | null
          service_buffer: number | null
          service_duration: number | null
          sgst_rate: number | null
          short_description: string | null
          sku: string | null
          stock_quantity: number | null
          tax_rate: number | null
          translations: Json | null
          unit: string | null
          updated_at: string
          variant_inventory: Json | null
          variants: Json | null
          warranty_info: string | null
          wholesale_price: number | null
        }
        Insert: {
          allow_partial_payment?: boolean | null
          apply_discount_on?: string | null
          barcode: string
          batch_id?: string | null
          category_id?: string | null
          cgst_rate?: number | null
          created_at?: string
          deleted_at?: string | null
          delivery_charge?: number | null
          description?: string | null
          dietary_preference?: string | null
          discount_type?: string | null
          discount_value?: number | null
          expiry_date?: string | null
          featured_products?: boolean | null
          gst_rate?: number | null
          has_variants?: boolean | null
          hsn?: string | null
          id?: string
          igst_rate?: number | null
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          is_inventory_tracked?: boolean | null
          is_pos_visible?: boolean | null
          is_visible_online?: boolean | null
          item_type?: Database["public"]["Enums"]["item_type_enum"] | null
          location?: string | null
          low_stock_threshold?: number | null
          metadata?: Json | null
          mfg_date?: string | null
          mrp?: number | null
          name: string
          name_secondary?: string | null
          online_description?: string | null
          online_price?: number | null
          organization_id: string
          partial_payment_amount?: number | null
          purchase_price?: number | null
          required_fields?: Json | null
          selling_price?: number | null
          serial_number?: string | null
          service_buffer?: number | null
          service_duration?: number | null
          sgst_rate?: number | null
          short_description?: string | null
          sku?: string | null
          stock_quantity?: number | null
          tax_rate?: number | null
          translations?: Json | null
          unit?: string | null
          updated_at?: string
          variant_inventory?: Json | null
          variants?: Json | null
          warranty_info?: string | null
          wholesale_price?: number | null
        }
        Update: {
          allow_partial_payment?: boolean | null
          apply_discount_on?: string | null
          barcode?: string
          batch_id?: string | null
          category_id?: string | null
          cgst_rate?: number | null
          created_at?: string
          deleted_at?: string | null
          delivery_charge?: number | null
          description?: string | null
          dietary_preference?: string | null
          discount_type?: string | null
          discount_value?: number | null
          expiry_date?: string | null
          featured_products?: boolean | null
          gst_rate?: number | null
          has_variants?: boolean | null
          hsn?: string | null
          id?: string
          igst_rate?: number | null
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          is_inventory_tracked?: boolean | null
          is_pos_visible?: boolean | null
          is_visible_online?: boolean | null
          item_type?: Database["public"]["Enums"]["item_type_enum"] | null
          location?: string | null
          low_stock_threshold?: number | null
          metadata?: Json | null
          mfg_date?: string | null
          mrp?: number | null
          name?: string
          name_secondary?: string | null
          online_description?: string | null
          online_price?: number | null
          organization_id?: string
          partial_payment_amount?: number | null
          purchase_price?: number | null
          required_fields?: Json | null
          selling_price?: number | null
          serial_number?: string | null
          service_buffer?: number | null
          service_duration?: number | null
          sgst_rate?: number | null
          short_description?: string | null
          sku?: string | null
          stock_quantity?: number | null
          tax_rate?: number | null
          translations?: Json | null
          unit?: string | null
          updated_at?: string
          variant_inventory?: Json | null
          variants?: Json | null
          warranty_info?: string | null
          wholesale_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "products_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "products_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_items: {
        Row: {
          batch_id: string | null
          batch_number: string | null
          created_at: string
          expiry_date: string | null
          id: string
          item_status: string | null
          mfg_date: string | null
          mrp: number | null
          negotiated_price: number | null
          notes: string | null
          product_id: string
          product_name: string
          purchase_order_id: string
          quantity: number
          quoted_price: number | null
          received_quantity: number | null
          requested_quantity: number | null
          selling_price: number | null
          sku: string | null
          total_price: number
          unit: string | null
          unit_price: number
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          batch_id?: string | null
          batch_number?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          item_status?: string | null
          mfg_date?: string | null
          mrp?: number | null
          negotiated_price?: number | null
          notes?: string | null
          product_id: string
          product_name: string
          purchase_order_id: string
          quantity: number
          quoted_price?: number | null
          received_quantity?: number | null
          requested_quantity?: number | null
          selling_price?: number | null
          sku?: string | null
          total_price: number
          unit?: string | null
          unit_price: number
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          batch_id?: string | null
          batch_number?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          item_status?: string | null
          mfg_date?: string | null
          mrp?: number | null
          negotiated_price?: number | null
          notes?: string | null
          product_id?: string
          product_name?: string
          purchase_order_id?: string
          quantity?: number
          quoted_price?: number | null
          received_quantity?: number | null
          requested_quantity?: number | null
          selling_price?: number | null
          sku?: string | null
          total_price?: number
          unit?: string | null
          unit_price?: number
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_order_payments: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          id: string
          organization_id: string
          payment_date: string | null
          payment_method: string | null
          purchase_order_id: string
          reference_number: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          organization_id: string
          payment_date?: string | null
          payment_method?: string | null
          purchase_order_id: string
          reference_number?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          organization_id?: string
          payment_date?: string | null
          payment_method?: string | null
          purchase_order_id?: string
          reference_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_payments_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string
          delivery_notes: string | null
          directory_vendor_id: string | null
          expected_delivery: string | null
          expected_delivery_date: string | null
          id: string
          idempotency_key: string | null
          is_received: boolean | null
          merchant_address: string | null
          merchant_location: string | null
          merchant_phone: string | null
          notes: string | null
          order_date: string
          order_number: string
          ordered_at: string | null
          organization_id: string
          paid_amount: number | null
          party_id: string | null
          payment_status: string | null
          quoted_at: string | null
          status: string | null
          total_amount: number
          total_quantity: number
          transporter_phone: string | null
          updated_at: string
          user_id: string
          vehicle_number: string | null
          vendor_address: string | null
          vendor_id: string | null
          vendor_location: string | null
          vendor_name: string | null
          vendor_phone: string | null
          workflow_status: string | null
        }
        Insert: {
          created_at?: string
          delivery_notes?: string | null
          directory_vendor_id?: string | null
          expected_delivery?: string | null
          expected_delivery_date?: string | null
          id?: string
          idempotency_key?: string | null
          is_received?: boolean | null
          merchant_address?: string | null
          merchant_location?: string | null
          merchant_phone?: string | null
          notes?: string | null
          order_date?: string
          order_number: string
          ordered_at?: string | null
          organization_id: string
          paid_amount?: number | null
          party_id?: string | null
          payment_status?: string | null
          quoted_at?: string | null
          status?: string | null
          total_amount?: number
          total_quantity?: number
          transporter_phone?: string | null
          updated_at?: string
          user_id: string
          vehicle_number?: string | null
          vendor_address?: string | null
          vendor_id?: string | null
          vendor_location?: string | null
          vendor_name?: string | null
          vendor_phone?: string | null
          workflow_status?: string | null
        }
        Update: {
          created_at?: string
          delivery_notes?: string | null
          directory_vendor_id?: string | null
          expected_delivery?: string | null
          expected_delivery_date?: string | null
          id?: string
          idempotency_key?: string | null
          is_received?: boolean | null
          merchant_address?: string | null
          merchant_location?: string | null
          merchant_phone?: string | null
          notes?: string | null
          order_date?: string
          order_number?: string
          ordered_at?: string | null
          organization_id?: string
          paid_amount?: number | null
          party_id?: string | null
          payment_status?: string | null
          quoted_at?: string | null
          status?: string | null
          total_amount?: number
          total_quantity?: number
          transporter_phone?: string | null
          updated_at?: string
          user_id?: string
          vehicle_number?: string | null
          vendor_address?: string | null
          vendor_id?: string | null
          vendor_location?: string | null
          vendor_name?: string | null
          vendor_phone?: string | null
          workflow_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "purchase_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "purchase_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties_masked"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          active: boolean
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_system_role: boolean
          name: string
          organization_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean
          name: string
          organization_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_system_role?: boolean
          name?: string
          organization_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      service_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          organization_id: string
          start_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          organization_id: string
          start_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          organization_id?: string
          start_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_availability_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "service_availability_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "service_availability_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      service_bookings: {
        Row: {
          amount_paid: number | null
          booking_date: string
          created_at: string
          customer_email: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          end_time: string
          id: string
          is_partial_payment: boolean | null
          items: Json | null
          notes: string | null
          organization_id: string
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          product_id: string
          product_name: string | null
          start_time: string
          status: string | null
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          booking_date: string
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_time: string
          id?: string
          is_partial_payment?: boolean | null
          items?: Json | null
          notes?: string | null
          organization_id: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          product_id: string
          product_name?: string | null
          start_time: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          booking_date?: string
          created_at?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          end_time?: string
          id?: string
          is_partial_payment?: boolean | null
          items?: Json | null
          notes?: string | null
          organization_id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          product_id?: string
          product_name?: string | null
          start_time?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "service_bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "service_bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "service_bookings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["product_id"]
          },
        ]
      }
      settlement_batches: {
        Row: {
          bank_reference: string | null
          batch_id: string
          created_at: string
          fee_amount: number
          gateway_name: string
          id: string
          metadata: Json | null
          net_amount: number
          organization_id: string
          settled_at: string | null
          settlement_date: string
          status: string
          tax_amount: number
          total_amount: number
          transaction_count: number
          utr_number: string | null
        }
        Insert: {
          bank_reference?: string | null
          batch_id: string
          created_at?: string
          fee_amount?: number
          gateway_name: string
          id?: string
          metadata?: Json | null
          net_amount: number
          organization_id: string
          settled_at?: string | null
          settlement_date: string
          status?: string
          tax_amount?: number
          total_amount: number
          transaction_count?: number
          utr_number?: string | null
        }
        Update: {
          bank_reference?: string | null
          batch_id?: string
          created_at?: string
          fee_amount?: number
          gateway_name?: string
          id?: string
          metadata?: Json | null
          net_amount?: number
          organization_id?: string
          settled_at?: string | null
          settlement_date?: string
          status?: string
          tax_amount?: number
          total_amount?: number
          transaction_count?: number
          utr_number?: string | null
        }
        Relationships: []
      }
      slow_query_log: {
        Row: {
          created_at: string
          execution_time_ms: number
          id: string
          organization_id: string | null
          query_text: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          execution_time_ms: number
          id?: string
          organization_id?: string | null
          query_text: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          execution_time_ms?: number
          id?: string
          organization_id?: string | null
          query_text?: string
          user_id?: string | null
        }
        Relationships: []
      }
      stock_deduction_log: {
        Row: {
          deducted_at: string | null
          id: string
          items: Json
          organization_id: string
          reference_id: string
        }
        Insert: {
          deducted_at?: string | null
          id?: string
          items: Json
          organization_id: string
          reference_id: string
        }
        Update: {
          deducted_at?: string | null
          id?: string
          items?: Json
          organization_id?: string
          reference_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_deduction_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "stock_deduction_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "stock_deduction_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_ledger: {
        Row: {
          batch_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          idempotency_key: string | null
          movement_type: Database["public"]["Enums"]["stock_movement_type"]
          notes: string | null
          organization_id: string
          product_id: string
          quantity_change: number
          reference_id: string | null
          variant_id: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          idempotency_key?: string | null
          movement_type: Database["public"]["Enums"]["stock_movement_type"]
          notes?: string | null
          organization_id: string
          product_id: string
          quantity_change: number
          reference_id?: string | null
          variant_id?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          idempotency_key?: string | null
          movement_type?: Database["public"]["Enums"]["stock_movement_type"]
          notes?: string | null
          organization_id?: string
          product_id?: string
          quantity_change?: number
          reference_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_ledger_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "stock_ledger_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "stock_ledger_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_ledger_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_ledger_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "stock_ledger_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "stock_ledger_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_ledger_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      store_chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          organization_id: string | null
          sender_type: string
          session_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          organization_id?: string | null
          sender_type: string
          session_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          organization_id?: string | null
          sender_type?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_chat_messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "store_chat_messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "store_chat_messages_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "store_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      store_chat_sessions: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          last_message_at: string | null
          organization_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          last_message_at?: string | null
          organization_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          last_message_at?: string | null
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_chat_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "store_chat_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "store_chat_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      store_coupons: {
        Row: {
          code: string
          created_at: string | null
          discount_type: string | null
          discount_value: number
          expires_at: string | null
          free_delivery: boolean | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          max_uses_per_customer: number | null
          min_order_value: number | null
          organization_id: string
          times_used: number | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_type?: string | null
          discount_value?: number
          expires_at?: string | null
          free_delivery?: boolean | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          max_uses_per_customer?: number | null
          min_order_value?: number | null
          organization_id: string
          times_used?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_type?: string | null
          discount_value?: number
          expires_at?: string | null
          free_delivery?: boolean | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          max_uses_per_customer?: number | null
          min_order_value?: number | null
          organization_id?: string
          times_used?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_coupons_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "store_coupons_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "store_coupons_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      store_domains: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          is_verified: boolean | null
          organization_id: string | null
          type: string
          updated_at: string | null
          verification_method: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id?: string
          is_verified?: boolean | null
          organization_id?: string | null
          type: string
          updated_at?: string | null
          verification_method?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          is_verified?: boolean | null
          organization_id?: string | null
          type?: string
          updated_at?: string | null
          verification_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_domains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "store_domains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "store_domains_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      store_enquiries: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_read: boolean | null
          message: string | null
          name: string | null
          organization_id: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          name?: string | null
          organization_id?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          name?: string | null
          organization_id?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_enquiries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "store_enquiries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "store_enquiries_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      store_notifications: {
        Row: {
          audience: string | null
          body: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string | null
          organization_id: string
          sent_at: string | null
          status: string | null
          title: string
        }
        Insert: {
          audience?: string | null
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          organization_id: string
          sent_at?: string | null
          status?: string | null
          title: string
        }
        Update: {
          audience?: string | null
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          organization_id?: string
          sent_at?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_notifications_org_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "store_notifications_org_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "store_notifications_org_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          end_date: string | null
          id: string
          organization_id: string
          plan_id: string | null
          snapshot_features: Json | null
          snapshot_limits: Json | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          end_date?: string | null
          id?: string
          organization_id: string
          plan_id?: string | null
          snapshot_features?: Json | null
          snapshot_limits?: Json | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          end_date?: string | null
          id?: string
          organization_id?: string
          plan_id?: string | null
          snapshot_features?: Json | null
          snapshot_limits?: Json | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      system_configurations: {
        Row: {
          created_at: string | null
          description: string | null
          is_secret: boolean | null
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          is_secret?: boolean | null
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          is_secret?: boolean | null
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      table_bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          duration_minutes: number | null
          guests: number
          id: string
          organization_id: string
          special_requests: string | null
          status: string | null
          table_id: string | null
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          duration_minutes?: number | null
          guests?: number
          id?: string
          organization_id: string
          special_requests?: string | null
          status?: string | null
          table_id?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          duration_minutes?: number | null
          guests?: number
          id?: string
          organization_id?: string
          special_requests?: string | null
          status?: string | null
          table_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "table_bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "table_bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_bookings_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "cafe_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      table_status_history: {
        Row: {
          changed_at: string | null
          changed_by: string | null
          duration_minutes: number | null
          id: string
          new_status: string
          order_id: string | null
          organization_id: string
          previous_status: string | null
          table_id: string
        }
        Insert: {
          changed_at?: string | null
          changed_by?: string | null
          duration_minutes?: number | null
          id?: string
          new_status: string
          order_id?: string | null
          organization_id: string
          previous_status?: string | null
          table_id: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string | null
          duration_minutes?: number | null
          id?: string
          new_status?: string
          order_id?: string | null
          organization_id?: string
          previous_status?: string | null
          table_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_status_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "table_status_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "table_status_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_status_history_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "cafe_tables"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_versions: {
        Row: {
          config: Json
          created_at: string | null
          created_by: string | null
          id: string
          notes: string | null
          organization_id: string
          theme_id: string
          version_number: number
        }
        Insert: {
          config: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          organization_id: string
          theme_id: string
          version_number: number
        }
        Update: {
          config?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          notes?: string | null
          organization_id?: string
          theme_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "theme_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "theme_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "theme_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tv_banners: {
        Row: {
          created_at: string | null
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          organization_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          organization_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          organization_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tv_banners_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "tv_banners_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "tv_banners_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      upi_redirects: {
        Row: {
          amount: number
          bank_reference_number: string | null
          created_at: string | null
          id: string
          merchant_transaction_id: string | null
          order_id: string
          organization_id: string
          payment_app: string | null
          status: string
          updated_at: string | null
          upi_id: string | null
        }
        Insert: {
          amount: number
          bank_reference_number?: string | null
          created_at?: string | null
          id?: string
          merchant_transaction_id?: string | null
          order_id: string
          organization_id: string
          payment_app?: string | null
          status?: string
          updated_at?: string | null
          upi_id?: string | null
        }
        Update: {
          amount?: number
          bank_reference_number?: string | null
          created_at?: string | null
          id?: string
          merchant_transaction_id?: string | null
          order_id?: string
          organization_id?: string
          payment_app?: string | null
          status?: string
          updated_at?: string | null
          upi_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "upi_redirects_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upi_redirects_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "upi_redirects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "upi_redirects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "upi_redirects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          organization_id: string
          role_id: string
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          organization_id: string
          role_id: string
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          organization_id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlist_items: {
        Row: {
          created_at: string | null
          organization_id: string
          party_id: string
          product_id: string
        }
        Insert: {
          created_at?: string | null
          organization_id: string
          party_id: string
          product_id: string
        }
        Update: {
          created_at?: string | null
          organization_id?: string
          party_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "wishlist_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "wishlist_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "parties_masked"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["product_id"]
          },
        ]
      }
    }
    Views: {
      daily_sales_summary: {
        Row: {
          gross_revenue: number | null
          organization_id: string | null
          sale_date: string | null
          total_orders: number | null
          total_tax: number | null
          unique_customers_served: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      index_usage_stats: {
        Row: {
          index_scans: number | null
          index_size: string | null
          indexname: unknown
          schemaname: unknown
          tablename: unknown
          tuples_fetched: number | null
          tuples_read: number | null
          usage_status: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string | null
          invoice_number: string | null
          invoice_type: string | null
          organization_id: string | null
          payment_method: string | null
          payment_status: string | null
          status: string | null
          table_number: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string | null
          invoice_number?: string | null
          invoice_type?: string | null
          organization_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          table_number?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string | null
          invoice_number?: string | null
          invoice_type?: string | null
          organization_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          status?: string | null
          table_number?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_activity_summary: {
        Row: {
          actions_last_24h: number | null
          active_users: number | null
          orders_last_30_days: number | null
          organization_id: string | null
          organization_name: string | null
          plan_name: string | null
          product_count: number | null
          quota_status: string | null
          revenue_last_30_days: number | null
          subscription_status: string | null
          total_users: number | null
        }
        Relationships: []
      }
      organization_counters: {
        Row: {
          counter_type: string | null
          last_value: number | null
          organization_id: string | null
          updated_at: string | null
        }
        Insert: {
          counter_type?: string | null
          last_value?: number | null
          organization_id?: string | null
          updated_at?: string | null
        }
        Update: {
          counter_type?: string | null
          last_value?: number | null
          organization_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_sequences_org_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_sequences_org_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_sequences_org_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_quota_status: {
        Row: {
          category_count: number | null
          category_limit: number | null
          monthly_invoice_count: number | null
          monthly_invoice_limit: number | null
          monthly_po_count: number | null
          monthly_po_limit: number | null
          organization_id: string | null
          organization_name: string | null
          plan_id: string | null
          plan_name: string | null
          product_count: number | null
          product_limit: number | null
          quota_status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      parties_masked: {
        Row: {
          address: string | null
          balance: number | null
          created_at: string | null
          credit_limit: number | null
          credit_limit_enabled: boolean | null
          email: string | null
          id: string | null
          loyalty_points: number | null
          mobile: string | null
          name: string | null
          notes: string | null
          organization_id: string | null
          party_type: string | null
          phone: string | null
          type: string | null
          updated_at: string | null
          wallet_balance: number | null
        }
        Insert: {
          address?: string | null
          balance?: number | null
          created_at?: string | null
          credit_limit?: number | null
          credit_limit_enabled?: boolean | null
          email?: never
          id?: string | null
          loyalty_points?: number | null
          mobile?: never
          name?: string | null
          notes?: string | null
          organization_id?: string | null
          party_type?: string | null
          phone?: never
          type?: string | null
          updated_at?: string | null
          wallet_balance?: number | null
        }
        Update: {
          address?: string | null
          balance?: number | null
          created_at?: string | null
          credit_limit?: number | null
          credit_limit_enabled?: boolean | null
          email?: never
          id?: string | null
          loyalty_points?: number | null
          mobile?: never
          name?: string | null
          notes?: string | null
          organization_id?: string | null
          party_type?: string | null
          phone?: never
          type?: string | null
          updated_at?: string | null
          wallet_balance?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parties_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "parties_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "parties_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_stock_realtime: {
        Row: {
          batch_id: string | null
          batch_number: string | null
          last_movement_at: string | null
          organization_id: string | null
          product_id: string | null
          product_name: string | null
          sku: string | null
          stock_quantity: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_ledger_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "stock_ledger_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "stock_ledger_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_ledger_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_ledger_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "view_inventory_summary"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "stock_ledger_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vw_inventory_status"
            referencedColumns: ["product_id"]
          },
        ]
      }
      system_health_metrics: {
        Row: {
          measured_at: string | null
          metric_name: string | null
          value: string | null
        }
        Relationships: []
      }
      table_performance_stats: {
        Row: {
          dead_row_percent: number | null
          dead_rows: number | null
          last_analyze: string | null
          last_autoanalyze: string | null
          last_autovacuum: string | null
          last_vacuum: string | null
          row_count: number | null
          schemaname: unknown
          tablename: unknown
          total_size: string | null
        }
        Relationships: []
      }
      view_daily_sales_stats: {
        Row: {
          online_orders: number | null
          online_sales: number | null
          organization_id: string | null
          paid_orders: number | null
          pos_orders: number | null
          pos_sales: number | null
          sale_date: string | null
          total_orders: number | null
          total_sales: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      view_inventory_summary: {
        Row: {
          batch_stock: number | null
          category_id: string | null
          category_name: string | null
          low_stock_threshold: number | null
          mrp: number | null
          next_expiry_date: string | null
          organization_id: string | null
          product_id: string | null
          product_name: string | null
          purchase_price: number | null
          selling_price: number | null
          total_stock: number | null
          unit: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "products_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "products_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      view_kitchen_display_board: {
        Row: {
          created_at: string | null
          customer_name: string | null
          items: Json | null
          kitchen_order_id: string | null
          kitchen_status: string | null
          organization_id: string | null
          table_number: string | null
          token_number: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_inventory_status: {
        Row: {
          organization_id: string | null
          product_id: string | null
          product_name: string | null
          stock: number | null
          variant_id: string | null
          variant_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_activity_summary"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "products_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organization_quota_status"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "products_organization_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      vw_partner_financial_overview: {
        Row: {
          account_number: string | null
          available_balance: number | null
          bank_name: string | null
          bank_verified: boolean | null
          commission_rate: number | null
          ifsc_code: string | null
          partner_id: string | null
          partner_name: string | null
          status: string | null
          total_accrued: number | null
          total_organizations: number | null
          total_settled: number | null
          upi_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_quote_and_order: {
        Args: { p_expected_delivery?: string; p_po_id: string }
        Returns: Json
      }
      accept_staff_invitation: { Args: { p_token: string }; Returns: Json }
      accept_staff_invite: { Args: { p_token: string }; Returns: Json }
      add_customer_address:
        | {
            Args: {
              p_address: string
              p_customer_id: string
              p_is_default?: boolean
              p_label?: string
              p_phone?: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_address_line1: string
              p_address_line2: string
              p_city: string
              p_customer_id: string
              p_full_name: string
              p_is_default?: boolean
              p_label?: string
              p_phone: string
              p_pincode: string
              p_state: string
            }
            Returns: Json
          }
      add_org_member_by_email: {
        Args: { p_email: string; p_org_id: string; p_role: string }
        Returns: Json
      }
      add_staff_member: {
        Args: { p_email: string; p_org_id: string; p_role_name: string }
        Returns: Json
      }
      admin_assign_organization_plan: {
        Args: { p_end_date?: string; p_org_id: string; p_plan_id: string }
        Returns: Json
      }
      admin_assign_user_plan:
        | {
            Args: {
              p_months?: number
              p_plan_id: string
              p_target_user_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_end_date?: string
              p_plan_id: string
              p_start_date?: string
              p_target_user_id: string
            }
            Returns: Json
          }
      admin_create_complete_user: {
        Args: {
          p_company_id: string
          p_email: string
          p_first_name?: string
          p_last_name?: string
          p_org_id: string
          p_phone?: string
          p_plan_expiry_date?: string
          p_plan_id?: string
          p_plan_start_date?: string
          p_user_id: string
        }
        Returns: undefined
      }
      admin_create_plan: {
        Args: {
          p_coupons: Json
          p_description: string
          p_discount_price: number
          p_features_json: Json
          p_is_active: boolean
          p_is_featured: boolean
          p_level: number
          p_limits: Json
          p_name: string
          p_price: number
          p_routes: string[]
        }
        Returns: string
      }
      admin_delete_partner: {
        Args: { p_fallback_partner_id?: string; p_partner_id: string }
        Returns: Json
      }
      admin_dispatch_broadcast: {
        Args: { p_broadcast_id: string }
        Returns: Json
      }
      admin_fetch_plans: { Args: never; Returns: Json }
      admin_get_all_org_usage: { Args: never; Returns: Json }
      admin_get_all_organizations: {
        Args: never
        Returns: {
          created_at: string
          current_plan_id: string
          current_plan_name: string
          display_id: string
          id: string
          name: string
          partner_id: string
          partner_name: string
          subscription_end_date: string
          subscription_status: string
          total_users: number
        }[]
      }
      admin_get_expiring_plans_for_notification: {
        Args: never
        Returns: {
          days_left: number
          expiry_date: string
          organization_id: string
          owner_email: string
          plan_name: string
        }[]
      }
      admin_get_organization_comprehensive_usage: {
        Args: { p_org_id: string }
        Returns: Json
      }
      admin_get_organization_usage: {
        Args: { p_org_id: string }
        Returns: Json
      }
      admin_get_system_activity: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: Json
      }
      admin_log_system_event: {
        Args: {
          p_action: string
          p_metadata?: Json
          p_new_value?: Json
          p_resource_id: string
          p_resource_type: string
          p_severity: string
        }
        Returns: undefined
      }
      admin_process_partner_settlement: {
        Args: {
          p_amount: number
          p_partner_id: string
          p_period_end: string
          p_period_start: string
          p_reference: string
        }
        Returns: Json
      }
      admin_process_settlement: {
        Args: {
          p_notes?: string
          p_reference: string
          p_settlement_id: string
          p_status: string
        }
        Returns: Json
      }
      admin_reset_organization_usage:
        | { Args: { p_org_id: string }; Returns: Json }
        | { Args: { p_metric?: string; p_org_id: string }; Returns: Json }
      admin_save_user_permissions:
        | {
            Args: {
              p_org_id: string
              p_permission_ids: string[]
              p_target_user_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_is_admin?: boolean
              p_org_id: string
              p_permission_ids: string[]
              p_target_user_id: string
            }
            Returns: Json
          }
      admin_toggle_user_status: {
        Args: { p_status: boolean; p_target_user_id: string }
        Returns: undefined
      }
      admin_update_monthly_quota: {
        Args: {
          p_max_invoices?: number
          p_max_products?: number
          p_max_users?: number
          p_storage_mb?: number
          p_target_user_id: string
        }
        Returns: Json
      }
      admin_update_organization_quota: {
        Args: { p_limits: Json; p_org_id: string }
        Returns: Json
      }
      admin_update_plan: {
        Args: {
          p_coupons: Json
          p_description: string
          p_discount_price: number
          p_features_json: Json
          p_is_active: boolean
          p_is_featured: boolean
          p_level: number
          p_limits: Json
          p_name: string
          p_plan_id: string
          p_price: number
          p_routes: string[]
        }
        Returns: undefined
      }
      admin_update_user_profile: {
        Args: {
          p_first_name: string
          p_last_name: string
          p_phone: string
          p_target_user_id: string
        }
        Returns: Json
      }
      admin_update_user_profile_full: {
        Args: {
          p_address?: string
          p_avatar_url?: string
          p_department?: string
          p_designation?: string
          p_employee_id?: string
          p_employment_status?: string
          p_first_name?: string
          p_last_name?: string
          p_phone?: string
          p_target_user_id: string
        }
        Returns: Json
      }
      apply_data_retention_policy: {
        Args: never
        Returns: {
          deleted_count: number
          table_name: string
        }[]
      }
      atomic_stock_update: {
        Args: {
          p_batch_id?: string
          p_organization_id: string
          p_product_id: string
          p_quantity: number
          p_variant_id?: string
        }
        Returns: boolean
      }
      award_loyalty_points: {
        Args: {
          p_invoice_id: string
          p_organization_id: string
          p_party_id: string
          p_sale_amount: number
          p_user_id?: string
        }
        Returns: Json
      }
      bulk_create_plans: {
        Args: { p_organization_id: string; p_plans: Json }
        Returns: {
          created_count: number
          errors: string[]
          failed_count: number
          success: boolean
        }[]
      }
      bulk_create_users: {
        Args: { p_organization_id: string; p_users: Json }
        Returns: {
          created_count: number
          errors: string[]
          failed_count: number
          success: boolean
        }[]
      }
      bulk_invite_staff: {
        Args: { p_emails: string[]; p_org_id: string; p_role: string }
        Returns: Json
      }
      calculate_inclusive_gst: {
        Args: { p_gst_rate: number; p_total_amount: number }
        Returns: {
          base_amount: number
          cgst_amount: number
          gst_amount: number
          gst_rate: number
          sgst_amount: number
          total_amount: number
        }[]
      }
      calculate_order_gst: { Args: { p_items: Json }; Returns: Json }
      calculate_partner_commission: {
        Args: {
          p_customer_user_id: string
          p_invoice_amount: number
          p_invoice_id: string
        }
        Returns: undefined
      }
      calculate_plan_quote: {
        Args: {
          p_coupon_code?: string
          p_duration_years?: number
          p_plan_id: string
        }
        Returns: Json
      }
      calculate_po_quoted_total: { Args: { po_id: string }; Returns: number }
      calculate_po_received_total: { Args: { po_id: string }; Returns: number }
      calculate_shipping_cost: {
        Args: {
          goods_value?: number
          route_id: string
          volume_m3?: number
          weight_kg: number
        }
        Returns: Json
      }
      cancel_booking: {
        Args: { p_booking_id: string; p_customer_id: string }
        Returns: Json
      }
      cancel_po: { Args: { p_po_id: string; p_reason: string }; Returns: Json }
      cancel_sale: {
        Args: { p_sale_id: string; p_user_id: string }
        Returns: Json
      }
      cancel_store_order: {
        Args: { p_customer_id: string; p_order_id: string }
        Returns: Json
      }
      cancel_subscription: {
        Args: {
          p_feedback?: string
          p_organization_id: string
          p_reason?: string
        }
        Returns: {
          cancelled_at: string
          message: string
          subscription_id: string
          success: boolean
        }[]
      }
      change_customer_password: {
        Args: {
          p_customer_id: string
          p_new_password: string
          p_old_password: string
        }
        Returns: Json
      }
      check_alert_conditions: {
        Args: never
        Returns: {
          alert_name: string
          message: string
          organization_id: string
          severity: string
        }[]
      }
      check_all_inventory_alerts: {
        Args: { p_organization_id: string }
        Returns: undefined
      }
      check_customer_email_exists: {
        Args: { p_email: string; p_exclude_customer_id?: string }
        Returns: boolean
      }
      check_idempotency: {
        Args: {
          p_endpoint: string
          p_organization_id: string
          p_request_hash: string
        }
        Returns: Json
      }
      check_is_member: { Args: { org_id: string }; Returns: boolean }
      check_is_owner: { Args: { org_id: string }; Returns: boolean }
      check_is_user_org_admin: { Args: { p_org_id: string }; Returns: boolean }
      check_org_feature: {
        Args: { p_feature_key: string; p_org_id: string }
        Returns: Json
      }
      check_org_limit: {
        Args: { p_limit_key: string; p_org_id: string; p_usage_key: string }
        Returns: Json
      }
      check_po_items_verified: { Args: { po_id: string }; Returns: boolean }
      check_quota_limit: {
        Args: { p_org_id: string; p_quota_type: string }
        Returns: boolean
      }
      check_store_name_availability: {
        Args: { requested_slug: string }
        Returns: boolean
      }
      check_user_exists: {
        Args: { p_email: string; p_phone: string }
        Returns: Json
      }
      check_user_in_org: { Args: { p_org_id: string }; Returns: boolean }
      check_user_in_org_safe: { Args: { org_id: string }; Returns: boolean }
      check_user_in_org_v2: { Args: { p_org_id: string }; Returns: boolean }
      cleanup_expired_idempotency_keys: { Args: never; Returns: number }
      cleanup_expired_password_resets: { Args: never; Returns: number }
      cleanup_old_audit_logs: {
        Args: { months_to_keep?: number }
        Returns: number
      }
      clear_organization_data: { Args: { org_id: string }; Returns: undefined }
      complete_po_and_update_inventory: {
        Args: { p_organization_id: string; p_po_id: string }
        Returns: Json
      }
      compute_audit_hash: {
        Args: {
          p_action: string
          p_created_at: string
          p_event_type: string
          p_id: string
          p_previous_hash: string
          p_resource_id: string
          p_resource_type: string
        }
        Returns: string
      }
      count_users_on_plan: { Args: { p_plan_id: string }; Returns: number }
      create_audit_log_partition_for_month: {
        Args: { partition_month: string }
        Returns: string
      }
      create_company: {
        Args: { p_name: string; p_owner_id: string }
        Returns: string
      }
      create_dine_in_order: {
        Args: {
          p_customer_id?: string
          p_customer_name: string
          p_customer_phone: string
          p_items: Json
          p_notes?: string
          p_store_id: string
          p_table_number: string
        }
        Returns: Json
      }
      create_draft_po: {
        Args: {
          p_directory_vendor_id?: string
          p_items: Json
          p_merchant_location: string
          p_notes?: string
          p_vendor_id: string
          p_vendor_location: string
        }
        Returns: Json
      }
      create_organization: {
        Args: {
          p_email: string
          p_name: string
          p_owner_user_id: string
          p_slug: string
        }
        Returns: string
      }
      create_plan: {
        Args: {
          p_coupons?: Json
          p_description: string
          p_discount: number
          p_name: string
          p_price: number
          p_routes?: string[]
        }
        Returns: undefined
      }
      create_public_order: {
        Args: { p_items: Json; p_order_details: Json }
        Returns: Json
      }
      create_shipment_for_po:
        | {
            Args: {
              p_po_id: string
              p_route_id?: string
              p_tracking_number?: string
              p_transport_company_id: string
              p_volume_m3?: number
              p_weight_kg?: number
            }
            Returns: Json
          }
        | {
            Args: {
              p_pickup_date?: string
              p_po_id: string
              p_route_id?: string
              p_transport_company_id: string
              p_volume_m3?: number
              p_weight_kg?: number
            }
            Returns: Json
          }
        | {
            Args: {
              estimated_delivery?: string
              purchase_order_id: string
              route_id: string
              status?: string
              tracking_number?: string
              transport_company_id: string
            }
            Returns: Json
          }
      create_slow_query_log_partition: { Args: never; Returns: undefined }
      create_staff_invitation: {
        Args: {
          p_expires?: string
          p_invitee_email: string
          p_organization_email: string
          p_permissions?: Json
          p_role?: string
        }
        Returns: Json
      }
      decrypt_pii: {
        Args: { p_encrypted: string; p_key: string }
        Returns: string
      }
      deduct_batch_stock: {
        Args: { p_batch_id: string; p_quantity: number; p_user_id: string }
        Returns: undefined
      }
      deduct_inventory_batch_locked: {
        Args: {
          p_items?: Json
          p_organization_id?: string
          p_reason?: string
          p_reference_id?: string
          p_user_id: string
        }
        Returns: Json
      }
      delete_company_user: { Args: { p_user_id: string }; Returns: undefined }
      delete_customer_address: {
        Args: { p_address_id: string; p_customer_id: string }
        Returns: Json
      }
      delete_staff_member: {
        Args: { p_org_id: string; p_target_user_id: string }
        Returns: Json
      }
      delete_user_data: { Args: { p_user_id?: string }; Returns: Json }
      delete_user_profile: { Args: { p_user_id: string }; Returns: Json }
      edit_staff_role: {
        Args: { p_new_role: string; p_org_id: string; p_target_user_id: string }
        Returns: Json
      }
      encrypt_pii: {
        Args: { p_key: string; p_plaintext: string }
        Returns: string
      }
      ensure_admin_role_for_user: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      ensure_org_usage_row: { Args: { p_org_id: string }; Returns: undefined }
      ensure_owner_admin: { Args: { p_user_id: string }; Returns: undefined }
      expire_old_plans: { Args: never; Returns: undefined }
      export_plans_json: { Args: { p_organization_id: string }; Returns: Json }
      export_user_data: { Args: { p_user_id?: string }; Returns: Json }
      export_users_json: { Args: { p_organization_id: string }; Returns: Json }
      fetch_staff_members: {
        Args: { p_org_id: string }
        Returns: {
          access_end_time: string
          access_start_time: string
          allowed_routes: Json
          created_at: string
          email: string
          full_name: string
          is_active: boolean
          member_display_id: string
          role_id: string
          role_name: string
          user_id: string
        }[]
      }
      finalize_table_billing: {
        Args: {
          p_org_id: string
          p_payment_method?: string
          p_table_name: string
          p_user_id: string
        }
        Returns: Json
      }
      find_transport_routes: {
        Args: {
          p_destination: string
          p_origin: string
          p_service_type?: string
        }
        Returns: {
          base_rate: number
          company_id: string
          company_name: string
          company_rating: number
          destination_region: string
          estimated_days: number
          origin_region: string
          rate_per_kg: number
          route_id: string
          route_name: string
          service_type: string
          total_cost_estimate: number
          vehicle_type: string
        }[]
      }
      fn_check_entitlement: {
        Args: { p_org_id: string; p_resource_type: string }
        Returns: boolean
      }
      format_billzest_id: {
        Args: { prefix: string; seq_val: number }
        Returns: string
      }
      generate_inventory_notification: {
        Args: {
          p_item_id: string
          p_link: string
          p_message: string
          p_org_id: string
          p_title: string
          p_type: string
        }
        Returns: undefined
      }
      generate_order_number: { Args: never; Returns: string }
      generate_po_number: {
        Args: { p_organization_id: string }
        Returns: string
      }
      generate_table_qr_token: { Args: { p_table_id: string }; Returns: Json }
      generate_tracking_number: { Args: never; Returns: string }
      get_all_system_user_stats: { Args: never; Returns: Json }
      get_all_system_users: {
        Args: never
        Returns: {
          address: string
          avatar_url: string
          company_name: string
          created_at: string
          department: string
          designation: string
          display_id: string
          email: string
          employee_id: string
          employment_status: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          organization_id: string
          phone: string
          plan_expiry_date: string
          plan_id: string
          plan_name: string
          plan_start_date: string
        }[]
      }
      get_all_users: {
        Args: never
        Returns: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
        }[]
      }
      get_audit_summary: {
        Args: {
          p_end_date?: string
          p_organization_id: string
          p_start_date?: string
        }
        Returns: Json
      }
      get_auth_user_org_id: { Args: never; Returns: string }
      get_auth_user_org_ids: { Args: never; Returns: string[] }
      get_cart: { Args: { p_customer_id: string }; Returns: Json }
      get_company_user_stats: { Args: { p_company_id?: string }; Returns: Json }
      get_company_users_with_plans: {
        Args: {
          p_company_id: string
          p_page?: number
          p_page_size?: number
          p_plan_id?: string
          p_search_query?: string
        }
        Returns: {
          address: string
          avatar_url: string
          created_at: string
          department: string
          designation: string
          email: string
          employee_id: string
          employment_status: string
          first_name: string
          id: string
          is_active: boolean
          last_name: string
          phone: string
          plan_expiry_date: string
          plan_id: string
          plan_name: string
          plan_start_date: string
          total_count: number
        }[]
      }
      get_comprehensive_reports: {
        Args: {
          p_end_date?: string
          p_organization_id: string
          p_start_date?: string
        }
        Returns: Json
      }
      get_current_user_company_id: { Args: never; Returns: string }
      get_customer_addresses: { Args: { p_customer_id: string }; Returns: Json }
      get_customer_chat_history: {
        Args: { p_customer_id: string; p_store_id: string }
        Returns: Json
      }
      get_customer_loyalty: { Args: { p_party_id: string }; Returns: Json }
      get_customer_wishlist: {
        Args: { p_customer_id: string }
        Returns: string[]
      }
      get_dashboard_stats: {
        Args: {
          p_end_date: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: Json
      }
      get_database_insights: { Args: never; Returns: Json }
      get_decrypted_global_secret: { Args: never; Returns: string }
      get_decrypted_merchant_secret: {
        Args: { p_user_id: string }
        Returns: string
      }
      get_inventory_stats: { Args: { p_org_id: string }; Returns: Json }
      get_login_email_by_display_id: {
        Args: { p_display_id: string }
        Returns: string
      }
      get_merchant_resend_key: { Args: { p_user_id: string }; Returns: string }
      get_my_bookings: {
        Args: { p_customer_id: string; p_store_id?: string }
        Returns: {
          amount_paid: number
          booking_date: string
          created_at: string
          end_time: string
          id: string
          merchant_name: string
          online_price: number
          payment_status: string
          product_name: string
          start_time: string
          status: string
          total_amount: number
        }[]
      }
      get_my_orders: {
        Args: { p_customer_id: string; p_store_id?: string }
        Returns: {
          address: string
          created_at: string
          id: string
          items: Json
          merchant_name: string
          order_number: string
          payment_status: string
          status: string
          total: number
        }[]
      }
      get_my_org_ids: { Args: never; Returns: string[] }
      get_next_invoice_details:
        | {
            Args: { p_org_id: string }
            Returns: {
              next_invoice_number: string
              next_invoice_sequence: number
            }[]
          }
        | {
            Args: { p_invoice_type: string; p_organization_id: string }
            Returns: {
              res_invoice_number: string
              res_sequence: number
            }[]
          }
      get_next_sequence_value: {
        Args: { p_org_id: string; p_type: string }
        Returns: number
      }
      get_next_token_id: {
        Args: { p_organization_id: string; p_type?: string }
        Returns: number
      }
      get_next_token_number: { Args: { p_org_id: string }; Returns: number }
      get_notification_recipients: {
        Args: { p_org_id: string }
        Returns: {
          user_id: string
        }[]
      }
      get_online_store_analytics:
        | { Args: { p_days: number; p_store_id: string }; Returns: Json }
        | { Args: { p_days?: number; p_store_id: string }; Returns: Json }
      get_or_create_customer_via_otp: {
        Args: { p_full_name?: string; p_phone: string }
        Returns: Json
      }
      get_or_init_bill_templates: { Args: never; Returns: Json }
      get_or_init_settings: {
        Args: { p_organization_id: string }
        Returns: Json
      }
      get_or_initialize_language_template: {
        Args: {
          p_default_translations: Json
          p_language_code: string
          p_organization_id: string
        }
        Returns: {
          created_at: string | null
          id: string
          language_code: string
          organization_id: string
          store_address: string | null
          store_name: string | null
          template_key: string
          template_value: string
          translations: Json | null
          updated_at: string | null
          user_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "language_templates"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_orders_diagnostic: {
        Args: {
          p_end_date: string
          p_organization_id: string
          p_start_date: string
        }
        Returns: Json
      }
      get_org_members_count: { Args: { p_org_id: string }; Returns: Json }
      get_org_next_invoice: { Args: { p_org_id: string }; Returns: string }
      get_org_plan_limits: {
        Args: { p_org_id: string }
        Returns: {
          max_members: number
          plan_features: Json
          plan_limits: Json
        }[]
      }
      get_org_staff: {
        Args: { p_org_id: string }
        Returns: {
          created_at: string
          email: string
          full_name: string
          is_active: boolean
          role_name: string
          user_id: string
        }[]
      }
      get_organization_plan_features: {
        Args: { p_org_id: string }
        Returns: string[]
      }
      get_overdue_parties: {
        Args: { merchant_id: string }
        Returns: {
          balance: number
          days_overdue: number
          due_date: string
          id: string
          mobile: string
          name: string
        }[]
      }
      get_partner_balance: { Args: { p_user_id: string }; Returns: Json }
      get_partner_customers: {
        Args: { partner_id: string }
        Returns: {
          business_name: string
          contact_name: string
          device_type: string
          email: string
          id: string
          joined_at: string
          phone: string
          plan_name: string
          status: string
          subscription_end_date: string
          subscription_start_date: string
        }[]
      }
      get_partner_dashboard_stats: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_partner_payouts: {
        Args: { partner_id: string }
        Returns: {
          amount: number
          id: string
          payout_date: string
          period_text: string
          reference_id: string
          status: string
        }[]
      }
      get_partner_renewals: {
        Args: { days_threshold?: number; partner_id: string }
        Returns: {
          business_name: string
          contact_name: string
          days_left: number
          expiry_date: string
          id: string
          phone: string
          plan_name: string
          status: string
        }[]
      }
      get_partner_settlement_history: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_party_summary: {
        Args: { p_party_type: string; p_user_id: string }
        Returns: {
          parties_with_due: number
          total_balance: number
          total_parties: number
        }[]
      }
      get_po_workflow_status: { Args: { p_po_id: string }; Returns: Json }
      get_product_rating: {
        Args: { pid: string }
        Returns: {
          avg_rating: number
          review_count: number
        }[]
      }
      get_public_store_data: { Args: { slug: string }; Returns: Json }
      get_quota_utilization: { Args: { p_org_id: string }; Returns: Json }
      get_sales_summary: {
        Args: { p_end_date: string; p_start_date: string; p_user_id: string }
        Returns: Json
      }
      get_store_chat_sessions: { Args: { p_store_id: string }; Returns: Json }
      get_store_theme_config: { Args: { p_org_id: string }; Returns: Json }
      get_table_analytics: {
        Args: { p_days?: number; p_org_id: string }
        Returns: {
          avg_covers_seated: number
          avg_sitting_time: number
          occupied_count: number
          peak_hour: string
          total_tables: number
          turnover_rate: number
        }[]
      }
      get_table_bill: {
        Args: { p_store_id: string; p_table_number: string }
        Returns: Json
      }
      get_table_overview: {
        Args: { p_org_id: string }
        Returns: {
          capacity_covers: number
          current_guest_count: number
          current_order_id: string
          customer_name: string
          duration_minutes: number
          is_merged: boolean
          order_amount: number
          seated_since: string
          status: string
          table_id: string
          table_number: string
          zone: string
        }[]
      }
      get_table_sizes: {
        Args: never
        Returns: {
          needs_partitioning: boolean
          row_count: number
          table_name: string
          total_size: string
        }[]
      }
      get_theme_presets: { Args: never; Returns: Json }
      get_theme_versions: {
        Args: { p_org_id: string; p_theme_id: string }
        Returns: {
          created_at: string
          created_by: string
          notes: string
          version_number: number
        }[]
      }
      get_transaction_history: {
        Args: { p_limit?: number; p_party_id?: string; p_user_id: string }
        Returns: {
          amount: number
          created_at: string
          date: string
          description: string
          id: string
          party_name: string
          party_type: string
          reference_number: string
          transaction_type: string
        }[]
      }
      get_upi_transaction_stats: {
        Args: { p_user_id: string }
        Returns: {
          failed_payments: number
          pending_payments: number
          successful_payments: number
          total_amount: number
          total_transactions: number
        }[]
      }
      get_user_by_email: { Args: { p_email: string }; Returns: Json }
      get_user_id_by_email: { Args: { p_email: string }; Returns: string }
      get_user_org_ids: { Args: never; Returns: string[] }
      get_user_plan_features: { Args: { p_user: string }; Returns: string[] }
      get_user_plan_limits: { Args: { p_user: string }; Returns: Json }
      get_user_role: {
        Args: { p_org_id: string; p_user_id: string }
        Returns: string
      }
      has_employee_privileges: { Args: { p_user_id: string }; Returns: boolean }
      has_feature_access: {
        Args: { p_feature_code: string; p_organization_id: string }
        Returns: boolean
      }
      has_permission: {
        Args: { p_org_id: string; p_permission_key: string }
        Returns: boolean
      }
      has_pii_access: { Args: { p_organization_id: string }; Returns: boolean }
      increment_coupon_usage: {
        Args: { p_code: string; p_store_id: string }
        Returns: undefined
      }
      increment_organization_usage: {
        Args: {
          p_column_name: string
          p_increment_val?: number
          p_org_id: string
        }
        Returns: undefined
      }
      init_default_floor: { Args: never; Returns: undefined }
      initialize_language_templates: {
        Args: { p_organization_id: string; p_user_id: string }
        Returns: Json
      }
      invite_staff_member: {
        Args: { p_email: string; p_org_id: string; p_role_name: string }
        Returns: Json
      }
      invite_staff_to_org:
        | {
            Args: { p_email: string; p_full_name: string; p_role_id: string }
            Returns: Json
          }
        | {
            Args: {
              p_email: string
              p_full_name: string
              p_inviter_id: string
              p_role_id: string
            }
            Returns: Json
          }
      is_app_super_admin: { Args: { p_user_id?: string }; Returns: boolean }
      is_org_admin:
        | { Args: { p_org_id: string; p_user_id?: string }; Returns: boolean }
        | { Args: { p_user_id: string }; Returns: boolean }
      is_org_member:
        | { Args: { org_id: string }; Returns: boolean }
        | { Args: { p_org_id: string; p_user_id?: string }; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      link_existing_user_to_org: {
        Args: { p_email: string; p_org_id: string; p_role_id: string }
        Returns: Json
      }
      list_company_plans: {
        Args: { p_company?: string }
        Returns: {
          coupons: Json
          description: string
          discount_price: number
          id: string
          name: string
          price: number
          routes: string[]
          slug: string
        }[]
      }
      log_audit_action:
        | {
            Args: {
              p_action: string
              p_metadata?: Json
              p_org_id: string
              p_resource_id: string
              p_resource_type: string
              p_user_id: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_action: string
              p_entity_id: string
              p_entity_type: string
              p_new_values?: Json
              p_old_values?: Json
              p_organization_id: string
            }
            Returns: string
          }
      log_billing_action: {
        Args: {
          p_action: string
          p_actor: string
          p_company: string
          p_metadata: Json
        }
        Returns: undefined
      }
      log_error: {
        Args: {
          p_context?: Json
          p_error_message: string
          p_error_stack?: string
          p_error_type: string
          p_severity?: string
        }
        Returns: string
      }
      log_expiry_notification_sent: {
        Args: { p_expiry_date: string; p_org_id: string }
        Returns: undefined
      }
      log_password_reset_completed: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      log_password_reset_request: {
        Args: {
          email_param: string
          ip_address_param?: string
          user_agent_param?: string
          user_id_param: string
        }
        Returns: string
      }
      log_slow_query: {
        Args: {
          p_execution_time_ms: number
          p_organization_id?: string
          p_query: string
        }
        Returns: undefined
      }
      login_customer: {
        Args: { p_email: string; p_password: string }
        Returns: Json
      }
      maintain_org_quota_cycle: {
        Args: { p_org_id: string }
        Returns: undefined
      }
      manage_plan_coupons: {
        Args: { p_coupons: Json; p_plan_id: string }
        Returns: undefined
      }
      mark_chat_read: {
        Args: { p_reader_type: string; p_session_id: string }
        Returns: undefined
      }
      mask_pii_in_jsonb: { Args: { data: Json }; Returns: Json }
      merge_tables: {
        Args: { p_primary_table_id: string; p_secondary_table_ids: string[] }
        Returns: Json
      }
      next_org_sequence: {
        Args: {
          p_org_id: string
          p_prefix: string
          p_reset_daily?: boolean
          p_sequence_type: string
        }
        Returns: {
          res_formatted: string
          res_sequence: number
        }[]
      }
      normalize_table_ref: { Args: { p_ref: string }; Returns: string }
      partner_complete_onboarding: {
        Args: {
          p_address: string
          p_business_name: string
          p_email: string
          p_merchant_user_id: string
          p_mobile: string
          p_person_name: string
        }
        Returns: Json
      }
      process_complete_sale:
        | {
            Args: {
              p_customer_name: string
              p_customer_phone: string
              p_guest_count?: number
              p_idempotency_key: string
              p_invoice_type: string
              p_items: Json
              p_party_id: string
              p_payment_method: string
              p_received_amount: number
              p_subtotal: number
              p_table_name?: string
              p_tax: number
              p_total: number
              p_user_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_coupon_code?: string
              p_coupon_discount?: number
              p_customer_address?: string
              p_customer_email?: string
              p_customer_name?: string
              p_customer_phone?: string
              p_delivery_charge?: number
              p_delivery_slot?: string
              p_delivery_type?: string
              p_existing_invoice_id?: string
              p_guest_count?: number
              p_idempotency_key?: string
              p_invoice_type?: string
              p_items: Json
              p_notes?: string
              p_organization_id: string
              p_packing_charge?: number
              p_party_id: string
              p_payment_method?: string
              p_received_amount?: number
              p_subtotal: number
              p_table_number?: string
              p_tax: number
              p_tip_amount?: number
              p_token_id?: string
              p_total: number
              p_user_id: string
            }
            Returns: Json
          }
      process_complete_sale_v2:
        | {
            Args: {
              p_customer_name?: string
              p_customer_phone?: string
              p_existing_invoice_id?: string
              p_invoice_type?: string
              p_items: Json
              p_notes: string
              p_organization_id: string
              p_party_id: string
              p_payment_method: string
              p_received_amount: number
              p_status?: string
              p_subtotal: number
              p_table_number?: string
              p_tax: number
              p_token_id?: number
              p_total: number
              p_user_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_customer_name?: string
              p_customer_phone?: string
              p_existing_invoice_id?: string
              p_invoice_type?: string
              p_items: Json
              p_notes: string
              p_party_id: string
              p_payment_method: string
              p_received_amount: number
              p_status?: string
              p_subtotal: number
              p_table_number?: string
              p_tax: number
              p_token_id?: number
              p_total: number
              p_user_id: string
            }
            Returns: Json
          }
      provide_quote: {
        Args: { p_items: Json; p_notes?: string; p_po_id: string }
        Returns: Json
      }
      publish_store_theme: {
        Args: { p_org_id: string; p_theme_id: string }
        Returns: Json
      }
      purchase_plan_extended: {
        Args: {
          p_company_id: string
          p_duration_years: number
          p_plan_id: string
        }
        Returns: Json
      }
      reactivate_subscription: {
        Args: { p_organization_id: string }
        Returns: {
          message: string
          new_expiry_date: string
          subscription_id: string
          success: boolean
        }[]
      }
      receive_and_verify_items:
        | { Args: { p_items: Json; p_po_id: string }; Returns: Json }
        | {
            Args: { p_items: Json; p_organization_id: string; p_po_id: string }
            Returns: Json
          }
      record_usage: {
        Args: {
          p_company: string
          p_feature: string
          p_period: unknown
          p_used: number
          p_user: string
        }
        Returns: undefined
      }
      redeem_loyalty_points: {
        Args: {
          p_bill_total: number
          p_invoice_id: string
          p_organization_id: string
          p_party_id: string
          p_points_to_redeem: number
          p_user_id?: string
        }
        Returns: Json
      }
      refresh_daily_sales_summary: { Args: never; Returns: undefined }
      refresh_user_permissions: {
        Args: { p_user_id: string }
        Returns: string[]
      }
      register_customer: {
        Args: {
          p_email: string
          p_full_name: string
          p_password: string
          p_phone?: string
        }
        Returns: Json
      }
      register_partner_details: {
        Args: {
          p_aadhar_number?: string
          p_address?: string
          p_bank_account_no?: string
          p_bank_name?: string
          p_gst_number?: string
          p_ifsc_code?: string
          p_pan_number?: string
        }
        Returns: undefined
      }
      remove_idempotency_key: {
        Args: { p_key: string; p_organization_id: string }
        Returns: boolean
      }
      remove_org_member: {
        Args: { p_org_id: string; p_target_user_id: string }
        Returns: undefined
      }
      repair_monthly_usage_sync: { Args: never; Returns: string }
      request_partner_payout: {
        Args: { p_amount: number; p_user_id: string }
        Returns: Json
      }
      resend_staff_invite: {
        Args: {
          p_expires?: string
          p_invitee_email: string
          p_org_email: string
        }
        Returns: Json
      }
      reset_monthly_usage: { Args: never; Returns: undefined }
      reset_monthly_usage_stats: { Args: never; Returns: undefined }
      resolve_cafe_table_name: {
        Args: { p_org_id: string; p_table_ref: string }
        Returns: string
      }
      resolve_product_gst_rate: {
        Args: { p_organization_id?: string; p_product_id: string }
        Returns: number
      }
      restock_cancelled_order: { Args: { p_order_id: string }; Returns: Json }
      run_daily_renewals: { Args: never; Returns: Json }
      seed_default_languages_for_user: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      send_chat_message: {
        Args: {
          p_content: string
          p_customer_id: string
          p_sender_type: string
          p_store_id: string
        }
        Returns: Json
      }
      send_po_for_quote: { Args: { p_po_id: string }; Returns: Json }
      send_staff_invite: {
        Args: {
          p_expires?: string
          p_invitee_email: string
          p_org_email: string
          p_permissions?: Json
          p_role?: string
        }
        Returns: Json
      }
      set_active_store_theme: {
        Args: { p_org_id: string; p_theme_id: string }
        Returns: undefined
      }
      set_staff_status: {
        Args: { p_org_email: string; p_status: string; p_user_id: string }
        Returns: Json
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      slugify_text: { Args: { "": string }; Returns: string }
      soft_delete_plan: { Args: { p_plan_id: string }; Returns: undefined }
      store_global_razorpay_secret: {
        Args: { p_secret_text: string }
        Returns: undefined
      }
      store_idempotency_response: {
        Args: {
          p_endpoint: string
          p_http_method: string
          p_organization_id: string
          p_request_body: Json
          p_request_hash: string
          p_response_body: Json
          p_response_status: number
        }
        Returns: string
      }
      store_merchant_razorpay_secret: {
        Args: { p_key_id: string; p_secret_text: string }
        Returns: Json
      }
      store_merchant_resend_secret: { Args: { p_key: string }; Returns: Json }
      sync_cafe_table_from_orders: {
        Args: { p_org_id: string; p_table_name: string }
        Returns: undefined
      }
      sync_cart: {
        Args: { p_customer_id: string; p_items: Json }
        Returns: undefined
      }
      toggle_member_status: {
        Args: {
          p_is_active: boolean
          p_organization_id: string
          p_user_id: string
        }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      toggle_staff_active: {
        Args: {
          p_is_active: boolean
          p_org_id: string
          p_target_user_id: string
        }
        Returns: Json
      }
      toggle_wishlist_item: {
        Args: { p_customer_id: string; p_product_id: string }
        Returns: boolean
      }
      transition_po_workflow: {
        Args: { new_status: string; notes?: string; po_id: string }
        Returns: Json
      }
      unmerge_tables: { Args: { p_primary_table_id: string }; Returns: Json }
      update_customer: {
        Args: { p_customer_id: string; p_full_name: string; p_phone: string }
        Returns: Json
      }
      update_member_role: {
        Args: {
          p_new_role: string
          p_organization_id: string
          p_user_id: string
        }
        Returns: {
          message: string
          success: boolean
        }[]
      }
      update_org_member_role: {
        Args: { p_new_role: string; p_org_id: string; p_target_user_id: string }
        Returns: undefined
      }
      update_plan_full: {
        Args: {
          p_coupons?: Json
          p_description?: string
          p_discount: number
          p_plan_id: string
          p_price: number
          p_routes: string[]
        }
        Returns: undefined
      }
      update_plan_routes: {
        Args: { p_plan_id: string; p_routes: string[] }
        Returns: undefined
      }
      update_reminder_sent: { Args: { party_id: string }; Returns: undefined }
      update_staff_member: {
        Args: {
          p_end_time?: string
          p_new_role_name: string
          p_org_id: string
          p_start_time?: string
          p_target_user_id: string
        }
        Returns: Json
      }
      update_staff_permissions: {
        Args: { p_org_email: string; p_permissions: Json; p_user_id: string }
        Returns: Json
      }
      update_store_order_address: {
        Args: {
          p_customer_id: string
          p_new_address: string
          p_order_id: string
        }
        Returns: Json
      }
      update_store_theme_config:
        | { Args: { p_config: Json; p_org_id: string }; Returns: undefined }
        | {
            Args: { p_config: Json; p_org_id: string; p_theme_id: string }
            Returns: Json
          }
      update_table_status: {
        Args: { p_new_status: string; p_order_id?: string; p_table_id: string }
        Returns: Json
      }
      upsert_user_setting: {
        Args: { setting_key: string; setting_value: boolean }
        Returns: undefined
      }
      user_has_org_access: {
        Args: { p_organization_id: string }
        Returns: boolean
      }
      user_has_permission: {
        Args: {
          p_organization_id: string
          p_permission_code: string
          p_user_id: string
        }
        Returns: boolean
      }
      user_is_org_admin: { Args: { p_org_id: string }; Returns: boolean }
      user_is_org_member: { Args: { p_org_id: string }; Returns: boolean }
      user_permissions:
        | { Args: { p_user_id: string }; Returns: string[] }
        | { Args: { p_org_id: string; p_user_id: string }; Returns: string[] }
      validate_coupon: {
        Args: { p_amount_cents: number; p_code: string; p_plan_id: string }
        Returns: Json
      }
      validate_email: { Args: { email: string }; Returns: boolean }
      validate_gst_number: { Args: { gst: string }; Returns: boolean }
      validate_phone_number: { Args: { phone: string }; Returns: boolean }
      validate_staff_invite: { Args: { p_token: string }; Returns: Json }
      verify_audit_log_integrity: {
        Args: { p_organization_id: string }
        Returns: {
          broken_at: string
          is_valid: boolean
          message: string
        }[]
      }
    }
    Enums: {
      app_module_type:
        | "POS"
        | "CAFE"
        | "ECOMMERCE"
        | "INVENTORY"
        | "SETTINGS"
        | "COMPANY"
        | "REPORTS"
      item_type_enum: "PRODUCT" | "SERVICE"
      kitchen_status_type:
        | "PENDING"
        | "PREPARING"
        | "READY"
        | "SERVED"
        | "CANCELLED"
      payment_ref_type: "ORDER" | "PURCHASE_ORDER" | "SUBSCRIPTION"
      price_tier_type: "RETAIL" | "WHOLESALE" | "ONLINE"
      stock_movement_type:
        | "SALE"
        | "PURCHASE"
        | "RETURN"
        | "ADJUSTMENT"
        | "TRANSFER"
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
    Enums: {
      app_module_type: [
        "POS",
        "CAFE",
        "ECOMMERCE",
        "INVENTORY",
        "SETTINGS",
        "COMPANY",
        "REPORTS",
      ],
      item_type_enum: ["PRODUCT", "SERVICE"],
      kitchen_status_type: [
        "PENDING",
        "PREPARING",
        "READY",
        "SERVED",
        "CANCELLED",
      ],
      payment_ref_type: ["ORDER", "PURCHASE_ORDER", "SUBSCRIPTION"],
      price_tier_type: ["RETAIL", "WHOLESALE", "ONLINE"],
      stock_movement_type: [
        "SALE",
        "PURCHASE",
        "RETURN",
        "ADJUSTMENT",
        "TRANSFER",
      ],
    },
  },
} as const
