// ============================================================================
// TIENDAZAP STUDIO — CLIENTE DE NUBE SUPABASE (ETAPA 3)
// window.CloudSync: Autenticación, Sincronización, Storage y Super-Admin
// ============================================================================

(function () {
  const CloudSync = {
    client: null,
    isConfigured: false,
    currentUser: null,
    currentProfile: null,
    isSyncing: false,

    // Inicialización del cliente Supabase
    init() {
      const cfg = window.TIENDAZAP_SUPABASE_CONFIG || {};
      const url = (cfg.url || "").trim();
      const anonKey = (cfg.anonKey || "").trim();

      // Validación amigable para no crashear si aún no se configuran las credenciales
      if (!url || !anonKey || url === "TU_SUPABASE_URL" || anonKey === "TU_SUPABASE_ANON_KEY") {
        this.isConfigured = false;
        this.client = null;
        console.log("ℹ️ TiendaZap: Modo local activo. Para activar la nube gratis, completa tus credenciales en supabase-config.js.");
        this.renderCloudStatusInUI();
        return;
      }

      try {
        if (typeof window.supabase === "undefined" || !window.supabase.createClient) {
          console.warn("⚠️ TiendaZap: SDK de Supabase v2 no encontrado en window.supabase.");
          return;
        }

        this.client = window.supabase.createClient(url, anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        this.isConfigured = true;
        console.log("☁️ TiendaZap: Conectado a Supabase exitosamente.");

        // Escuchar cambios de autenticación
        this.client.auth.onAuthStateChange(async (event, session) => {
          if (session && session.user) {
            this.currentUser = session.user;
            await this.fetchProfile(session.user.id);
          } else {
            this.currentUser = null;
            this.currentProfile = null;
          }
          this.renderCloudStatusInUI();
        });

        // Obtener sesión inicial
        this.checkInitialSession();
      } catch (err) {
        console.warn("⚠️ TiendaZap: Error al inicializar cliente de Supabase:", err);
        this.isConfigured = false;
        this.client = null;
      }
    },

    async checkInitialSession() {
      if (!this.client) return;
      try {
        const { data: { session }, error } = await this.client.auth.getSession();
        if (session && session.user) {
          this.currentUser = session.user;
          await this.fetchProfile(session.user.id);
          this.renderCloudStatusInUI();
        }
      } catch (e) {
        console.warn("Error al verificar sesión:", e);
      }
    },

    async fetchProfile(userId) {
      if (!this.client || !userId) return;
      try {
        const { data, error } = await this.client
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();

        if (data) {
          this.currentProfile = data;
        } else if (this.currentUser) {
          // Crear perfil base si no existía
          const cfg = window.TIENDAZAP_SUPABASE_CONFIG || {};
          const isSuper = (this.currentUser.email || "").toLowerCase() === (cfg.superAdminEmail || "").toLowerCase();
          const newProfile = {
            id: this.currentUser.id,
            email: this.currentUser.email,
            full_name: this.currentUser.user_metadata?.full_name || this.currentUser.email.split("@")[0],
            role: isSuper ? "superadmin" : "merchant"
          };
          const { data: created } = await this.client.from("profiles").upsert(newProfile).select().maybeSingle();
          if (created) this.currentProfile = created;
        }
      } catch (e) {
        console.warn("Error al cargar perfil:", e);
      }
    },

    isReady() {
      return this.isConfigured && !!this.client;
    },

    isAuthenticated() {
      return this.isReady() && !!this.currentUser;
    },

    getCurrentUser() {
      return this.currentUser;
    },

    isSuperAdmin() {
      if (!this.currentUser) return false;
      const cfg = window.TIENDAZAP_SUPABASE_CONFIG || {};
      const targetSuper = (cfg.superAdminEmail || "").toLowerCase();
      const mailMatches = !!targetSuper && targetSuper !== "tu_correo_superadmin" && (this.currentUser.email || "").toLowerCase() === targetSuper;
      const roleMatches = this.currentProfile && this.currentProfile.role === "superadmin";
      return mailMatches || roleMatches;
    },

    // 1. AUTENTICACIÓN (REGISTRO, LOGIN Y COMPATIBILIDAD)
    async signUp(email, password, fullName = "") {
      if (!this.isReady()) {
        return { ok: false, msg: "Configura primero tu URL y Anon Key en supabase-config.js para usar la nube." };
      }

      const cleanEmail = (email || "").trim().toLowerCase();
      const cleanPass = (password || "").trim();

      if (!cleanEmail || !cleanPass) {
        return { ok: false, msg: "Ingresa un correo y una contraseña válida." };
      }

      if (cleanPass.length < 6) {
        return { ok: false, msg: "La contraseña debe tener mínimo 6 caracteres." };
      }

      try {
        const { data: signData, error: signError } = await this.client.auth.signUp({
          email: cleanEmail,
          password: cleanPass,
          options: {
            data: { full_name: fullName || cleanEmail.split("@")[0] }
          }
        });

        if (signError) {
          const isAlreadyRegistered = /already registered|user already exists|identities/i.test(signError.message || "");
          if (isAlreadyRegistered) {
            return { ok: false, alreadyRegistered: true, msg: "Este correo ya está registrado. Selecciona 'Iniciar sesión'." };
          }
          return { ok: false, msg: signError.message };
        }

        if (signData && signData.user) {
          this.currentUser = signData.user;
          await this.fetchProfile(this.currentUser.id);
          this.renderCloudStatusInUI();
          return { ok: true, user: this.currentUser, isNew: true };
        }

        return { ok: false, msg: "No se pudo completar el registro." };
      } catch (err) {
        return { ok: false, msg: err.message || "Error al conectar con Supabase." };
      }
    },

    async signIn(email, password) {
      if (!this.isReady()) {
        return { ok: false, msg: "Configura primero tu URL y Anon Key en supabase-config.js para usar la nube." };
      }

      const cleanEmail = (email || "").trim().toLowerCase();
      const cleanPass = (password || "").trim();

      if (!cleanEmail || !cleanPass) {
        return { ok: false, msg: "Ingresa tu correo y contraseña." };
      }

      try {
        const { data: loginData, error: loginError } = await this.client.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass
        });

        if (loginError) {
          const isInvalid = /invalid login credentials|invalid credentials/i.test(loginError.message || "");
          return { ok: false, msg: isInvalid ? "Correo o contraseña incorrectos." : loginError.message };
        }

        if (loginData && loginData.user) {
          this.currentUser = loginData.user;
          await this.fetchProfile(this.currentUser.id);
          this.renderCloudStatusInUI();
          return { ok: true, user: this.currentUser, isNew: false };
        }

        return { ok: false, msg: "No se pudo iniciar sesión." };
      } catch (err) {
        return { ok: false, msg: err.message || "Error al conectar con Supabase." };
      }
    },

    async signUpOrSignIn(email, password, fullName = "") {
      if (!this.isReady()) {
        return { ok: false, msg: "Configura primero tu URL y Anon Key en supabase-config.js para usar la nube." };
      }

      const cleanEmail = (email || "").trim().toLowerCase();
      const cleanPass = (password || "").trim();

      if (!cleanEmail || !cleanPass) {
        return { ok: false, msg: "Ingresa un correo y una contraseña válida." };
      }

      if (cleanPass.length < 6) {
        return { ok: false, msg: "La contraseña debe tener mínimo 6 caracteres." };
      }

      try {
        // Intento 1: Registro (SignUp)
        const { data: signData, error: signError } = await this.client.auth.signUp({
          email: cleanEmail,
          password: cleanPass,
          options: {
            data: { full_name: fullName || cleanEmail.split("@")[0] }
          }
        });

        if (signError) {
          // Si el usuario ya existe, intentar Login (SignInWithPassword)
          const isAlreadyRegistered = /already registered|user already exists|identities/i.test(signError.message || "");
          if (isAlreadyRegistered) {
            const { data: loginData, error: loginError } = await this.client.auth.signInWithPassword({
              email: cleanEmail,
              password: cleanPass
            });

            if (loginError) {
              return { ok: false, msg: "Contraseña incorrecta o correo ya registrado: " + loginError.message };
            }

            this.currentUser = loginData.user;
            await this.fetchProfile(this.currentUser.id);
            this.renderCloudStatusInUI();
            return { ok: true, user: this.currentUser, isNew: false };
          }

          return { ok: false, msg: signError.message };
        }

        if (signData.user) {
          this.currentUser = signData.user;
          await this.fetchProfile(this.currentUser.id);
          this.renderCloudStatusInUI();
          return { ok: true, user: this.currentUser, isNew: true };
        }

        return { ok: false, msg: "No se pudo completar el acceso." };
      } catch (err) {
        return { ok: false, msg: err.message || "Error al conectar con Supabase." };
      }
    },

    async signOut() {
      if (this.client) {
        await this.client.auth.signOut();
      }
      this.currentUser = null;
      this.currentProfile = null;
      this.renderCloudStatusInUI();
      if (typeof Toast !== "undefined") Toast.show("Sesión de nube cerrada", "☁️");
      return { ok: true };
    },

    // 2. VALIDACIÓN DE SLUG ÚNICO EN TIEMPO REAL
    async checkSlugAvailability(slug, excludeStoreId = null) {
      if (!this.isReady()) {
        return { available: true, isCloud: false };
      }

      const cleanSlug = (slug || "").trim().toLowerCase();
      if (!cleanSlug) return { available: false, msg: "Slug vacío" };

      try {
        let query = this.client
          .from("stores")
          .select("id, slug")
          .ilike("slug", cleanSlug);

        if (excludeStoreId) {
          query = query.neq("id", excludeStoreId);
        }

        const { data, error } = await query;
        if (error) {
          console.warn("Error al chequear slug en Supabase:", error);
          return { available: true, error };
        }

        if (data && data.length > 0) {
          const suggestion = `${cleanSlug}-${Math.floor(10 + Math.random() * 90)}`;
          return {
            available: false,
            msg: "Este enlace ya está en uso, prueba otro",
            suggestion: suggestion
          };
        }

        return { available: true };
      } catch (e) {
        return { available: true };
      }
    },

    // 3. SUBIDA REAL DE ARCHIVOS A SUPABASE STORAGE (tiendazap-media)
    async uploadMedia(fileOrDataUrl, folderPath = "uploads") {
      if (!this.isReady() || !this.isAuthenticated()) {
        // Fallback local: conserva el DataURL o archivo local sin romper nada
        return { ok: true, url: typeof fileOrDataUrl === "string" ? fileOrDataUrl : URL.createObjectURL(fileOrDataUrl), localFallback: true };
      }

      const cfg = window.TIENDAZAP_SUPABASE_CONFIG || {};
      const bucket = cfg.storageBucket || "tiendazap-media";

      try {
        let blob;
        let ext = "jpg";
        let contentType = "image/jpeg";

        if (typeof fileOrDataUrl === "string") {
          if (fileOrDataUrl.startsWith("http://") || fileOrDataUrl.startsWith("https://")) {
            // Ya es una URL remota permanente
            return { ok: true, url: fileOrDataUrl };
          }

          if (fileOrDataUrl.startsWith("data:")) {
            const parts = fileOrDataUrl.split(",");
            const match = parts[0].match(/:(.*?);/);
            contentType = match ? match[1] : "image/jpeg";
            ext = contentType.split("/")[1] || "jpg";
            if (ext === "quicktime") ext = "mov";
            if (ext.includes("+")) ext = ext.split("+")[0];

            const bstr = atob(parts[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            blob = new Blob([u8arr], { type: contentType });
          } else {
            return { ok: true, url: fileOrDataUrl };
          }
        } else if (fileOrDataUrl instanceof Blob || fileOrDataUrl instanceof File) {
          blob = fileOrDataUrl;
          contentType = fileOrDataUrl.type || "image/jpeg";
          const matchExt = (fileOrDataUrl.name || "").split(".").pop();
          if (matchExt) ext = matchExt.toLowerCase();
        } else {
          return { ok: false, msg: "Formato de archivo no reconocido." };
        }

        const fileName = `${this.currentUser.id}/${folderPath}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;

        const { data, error } = await this.client.storage
          .from(bucket)
          .upload(fileName, blob, {
            contentType: contentType,
            upsert: true
          });

        if (error) {
          console.warn("Error al subir a Supabase Storage:", error);
          // Si falla permisos de storage, fallback a DataURL sin crashear
          return { ok: true, url: typeof fileOrDataUrl === "string" ? fileOrDataUrl : URL.createObjectURL(blob), localFallback: true, error };
        }

        const { data: pubData } = this.client.storage.from(bucket).getPublicUrl(fileName);
        return { ok: true, url: pubData.publicUrl };
      } catch (err) {
        console.warn("Excepción al subir archivo a Storage:", err);
        return { ok: true, url: typeof fileOrDataUrl === "string" ? fileOrDataUrl : "", localFallback: true };
      }
    },

    // 4. SINCRONIZACIÓN DE TIENDA, CATÁLOGOS Y PRODUCTOS
    async syncStoreToCloud(storeObj) {
      if (!this.isReady() || !this.isAuthenticated() || !storeObj) {
        return { ok: false, localOnly: true };
      }

      this.isSyncing = true;
      this.showSyncBadge("Sincronizando...", "🔄");

      try {
        const ownerId = this.currentUser.id;
        const storeId = storeObj.id || crypto.randomUUID();
        const slug = (storeObj.slug || storeObj.config?.slug || AppState.generateSlug(storeObj.name || "tienda")).toLowerCase();

        // A. Upsert de la Tienda
        const storeRow = {
          id: storeId,
          owner_id: ownerId,
          name: storeObj.name || "Mi Tienda",
          slug: slug,
          preset: storeObj.preset || storeObj.config?.niche || "general",
          phone: storeObj.config?.phone || storeObj.phone || "",
          currency: storeObj.config?.currency || storeObj.currency || "S/",
          config: storeObj.config || {},
          categories: storeObj.categories || [],
          is_active: storeObj.isActive !== false,
          updated_at: new Date().toISOString()
        };

        const { error: storeErr } = await this.client
          .from("stores")
          .upsert(storeRow, { onConflict: "id" });

        if (storeErr) {
          console.error("Error al sincronizar tienda en Supabase:", storeErr);
          this.showSyncBadge("Error al sincronizar", "⚠️");
          this.isSyncing = false;
          return { ok: false, error: storeErr };
        }

        // B. Upsert de Catálogos vinculados a la tienda
        const catalogs = Array.isArray(storeObj.catalogs) && storeObj.catalogs.length > 0
          ? storeObj.catalogs
          : [{ id: "cat_main", name: "Catálogo Principal", slug: "principal", isDefault: true }];

        const catalogRows = catalogs.map(c => ({
          id: `${storeId}_${c.id}`,
          store_id: storeId,
          name: c.name || "Catálogo",
          slug: (c.slug || AppState.generateSlug(c.name || "cat")).toLowerCase(),
          is_default: !!c.isDefault
        }));

        await this.client.from("catalogs").upsert(catalogRows, { onConflict: "id" });

        // C. Upsert de Productos vinculados a la tienda
        const products = Array.isArray(storeObj.products) ? storeObj.products : [];
        if (products.length > 0) {
          const productRows = products.map(p => ({
            id: `${storeId}_${p.id}`,
            store_id: storeId,
            catalog_id: p.catalogId || "cat_main",
            sku: p.sku || null,
            name: p.name || "Producto",
            category: p.category || "General",
            price: Number(p.price || 0),
            currency: p.currency || storeRow.currency,
            description: p.desc || "",
            listing_type: p.listingType || "item",
            condition: p.condition || null,
            location: p.location || null,
            specs: p.specs || [],
            images: p.images || (p.img ? [p.img] : []),
            video_url: p.videoUrl || null,
            sizes: p.sizes || [],
            colors: p.colors || [],
            promo: !!p.promo,
            available: p.available !== false,
            updated_at: new Date().toISOString()
          }));

          await this.client.from("products").upsert(productRows, { onConflict: "id" });
        }

        this.showSyncBadge("Sincronizado en la nube", "☁️");
        this.isSyncing = false;
        return { ok: true, storeId, slug };
      } catch (err) {
        console.error("Excepción en syncStoreToCloud:", err);
        this.showSyncBadge("Error en nube", "⚠️");
        this.isSyncing = false;
        return { ok: false, error: err };
      }
    },

    // 5. CARGA DE TIENDAS DEL PROPIETARIO AUTENTICADO
    async loadMyStoresFromCloud() {
      if (!this.isReady() || !this.isAuthenticated()) return null;

      try {
        const { data: stores, error } = await this.client
          .from("stores")
          .select("*, catalogs(*), products(*)")
          .eq("owner_id", this.currentUser.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("Error al cargar tiendas desde Supabase:", error);
          return null;
        }

        if (stores && stores.length > 0) {
          const mappedStores = stores.map(s => {
            const catalogs = (s.catalogs || []).map(c => ({
              id: c.id.replace(`${s.id}_`, ""),
              name: c.name,
              slug: c.slug,
              isDefault: c.is_default
            }));

            const products = (s.products || []).map(p => ({
              id: p.id.replace(`${s.id}_`, ""),
              catalogId: p.catalog_id,
              sku: p.sku || "",
              name: p.name,
              category: p.category,
              price: Number(p.price),
              currency: p.currency,
              desc: p.description || "",
              listingType: p.listing_type,
              condition: p.condition,
              location: p.location,
              specs: p.specs || [],
              images: p.images || [],
              img: (p.images && p.images[0]) || "",
              videoUrl: p.video_url || "",
              sizes: p.sizes || [],
              colors: p.colors || [],
              promo: p.promo,
              available: p.available
            }));

            return {
              id: s.id,
              name: s.name,
              slug: s.slug,
              preset: s.preset,
              isActive: s.is_active,
              config: {
                ...s.config,
                name: s.name,
                slug: s.slug,
                niche: s.preset,
                currency: s.currency,
                phone: s.phone
              },
              categories: s.categories || [],
              catalogs: catalogs.length > 0 ? catalogs : [{ id: "cat_main", name: "Catálogo Principal", slug: "principal", isDefault: true }],
              products: products
            };
          });

          return mappedStores;
        }

        return [];
      } catch (err) {
        console.warn("Excepción al cargar tiendas del usuario:", err);
        return null;
      }
    },

    // 6. CARGA PÚBLICA INSTANTÁNEA POR SLUG (?tienda=slug o /slug)
    async fetchPublicStoreBySlug(slug, catalogSlug = null) {
      if (!this.isReady()) return null;

      const cleanSlug = (slug || "").trim().toLowerCase();
      if (!cleanSlug) return null;

      try {
        const { data: store, error } = await this.client
          .from("stores")
          .select("*")
          .ilike("slug", cleanSlug)
          .maybeSingle();

        if (error || !store) {
          return null;
        }

        if (store.is_active === false) {
          return { inactive: true, store };
        }

        // Cargar Catálogos
        const { data: catalogs } = await this.client
          .from("catalogs")
          .select("*")
          .eq("store_id", store.id);

        // Cargar Productos
        const { data: products } = await this.client
          .from("products")
          .select("*")
          .eq("store_id", store.id)
          .order("created_at", { ascending: true });

        const mappedCatalogs = (catalogs || []).map(c => ({
          id: c.id.replace(`${store.id}_`, ""),
          name: c.name,
          slug: c.slug,
          isDefault: c.is_default
        }));

        const mappedProducts = (products || []).map(p => ({
          id: p.id.replace(`${store.id}_`, ""),
          catalogId: p.catalog_id,
          sku: p.sku || "",
          name: p.name,
          category: p.category,
          price: Number(p.price),
          currency: p.currency,
          desc: p.description || "",
          listingType: p.listing_type,
          condition: p.condition,
          location: p.location,
          specs: p.specs || [],
          images: p.images || [],
          img: (p.images && p.images[0]) || "",
          videoUrl: p.video_url || "",
          sizes: p.sizes || [],
          colors: p.colors || [],
          promo: p.promo,
          available: p.available
        }));

        return {
          ok: true,
          store: {
            id: store.id,
            name: store.name,
            slug: store.slug,
            preset: store.preset,
            isActive: store.is_active,
            config: {
              ...store.config,
              name: store.name,
              slug: store.slug,
              niche: store.preset,
              currency: store.currency,
              phone: store.phone
            },
            categories: store.categories || [],
            catalogs: mappedCatalogs,
            products: mappedProducts
          }
        };
      } catch (err) {
        console.warn("Error al cargar tienda pública:", err);
        return null;
      }
    },

    // 7. SUPER-ADMIN: GESTIÓN GLOBAL DE TIENDAS
    async fetchAllStoresForAdmin() {
      if (!this.isSuperAdmin()) {
        return { ok: false, msg: "Acceso no autorizado" };
      }

      try {
        const { data, error } = await this.client
          .from("stores")
          .select("id, name, slug, preset, is_active, created_at, owner_id")
          .order("created_at", { ascending: false });

        if (error) return { ok: false, error };
        return { ok: true, stores: data || [] };
      } catch (err) {
        return { ok: false, error: err };
      }
    },

    async toggleStoreStatus(storeId, isActive) {
      if (!this.isSuperAdmin()) {
        return { ok: false, msg: "Acceso no autorizado" };
      }

      try {
        const { data, error } = await this.client
          .from("stores")
          .update({ is_active: isActive, updated_at: new Date().toISOString() })
          .eq("id", storeId)
          .select()
          .maybeSingle();

        if (error) return { ok: false, error };
        return { ok: true, store: data };
      } catch (err) {
        return { ok: false, error: err };
      }
    },

    // 8. ELEMENTOS DE UI Y MODALES (EMIL KOWALSKI DESIGN)
    renderCloudStatusInUI() {
      const switcherBtn = document.getElementById("dropdown-cloud-auth-btn");
      const superAdminBtn = document.getElementById("dropdown-superadmin-btn");
      const syncBadge = document.getElementById("cloud-sync-status-indicator");

      if (switcherBtn) {
        if (!this.isConfigured) {
          switcherBtn.innerHTML = `
            <span class="dropdown-item-icon">⚙️</span>
            <span>Conectar Supabase (Modo local)</span>
          `;
          switcherBtn.classList.remove("logged-in");
        } else if (this.isAuthenticated()) {
          const emailDisplay = this.currentUser.email || "Usuario";
          switcherBtn.innerHTML = `
            <span class="dropdown-item-icon">☁️</span>
            <div style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.2;">
              <span style="font-size:0.8rem; font-weight:600; color:#10b981;">Conectado a la Nube</span>
              <span style="font-size:0.73rem; opacity:0.8; max-width:180px; overflow:hidden; text-overflow:ellipsis;">${emailDisplay}</span>
            </div>
          `;
          switcherBtn.classList.add("logged-in");
        } else {
          switcherBtn.innerHTML = `
            <span class="dropdown-item-icon">☁️</span>
            <span>Iniciar Sesión / Nube</span>
          `;
          switcherBtn.classList.remove("logged-in");
        }
      }

      if (superAdminBtn) {
        if (this.isSuperAdmin()) {
          superAdminBtn.classList.remove("hidden");
        } else {
          superAdminBtn.classList.add("hidden");
        }
      }

      if (syncBadge) {
        if (!this.isConfigured) {
          syncBadge.innerHTML = `<span class="sync-dot local"></span> Local`;
          syncBadge.title = "Guardando en almacenamiento local del navegador";
        } else if (this.isAuthenticated()) {
          syncBadge.innerHTML = `<span class="sync-dot online"></span> Nube`;
          syncBadge.title = `Sincronizado con Supabase (${this.currentUser.email})`;
        } else {
          syncBadge.innerHTML = `<span class="sync-dot offline"></span> Desconectado`;
          syncBadge.title = "Supabase configurado pero sesión no iniciada";
        }
      }

      // Banner de promoción de sincronización en Mi Tienda
      const promoBanner = document.getElementById("cloud-sync-promo-banner");
      if (promoBanner) {
        if (this.isAuthenticated()) {
          promoBanner.classList.add("hidden");
        } else {
          promoBanner.classList.remove("hidden");
        }
      }
    },

    showSyncBadge(msg, icon = "☁️") {
      const badge = document.getElementById("cloud-sync-status-indicator");
      if (badge) {
        badge.innerHTML = `<span class="sync-dot online"></span> ${msg}`;
        setTimeout(() => {
          this.renderCloudStatusInUI();
        }, 3000);
      }
    },

    openAuthModal(initialTab = "login") {
      const modal = document.getElementById("cloud-auth-modal");
      if (!modal) return;
      const emailInput = document.getElementById("cloud-auth-email");
      const passInput = document.getElementById("cloud-auth-password");
      const passConfirmInput = document.getElementById("cloud-auth-password-confirm");
      const errBox = document.getElementById("cloud-auth-error");
      const tabSignup = document.getElementById("cloud-tab-signup");
      const tabLogin = document.getElementById("cloud-tab-login");
      const confirmGroup = document.getElementById("cloud-confirm-password-group");
      const submitBtn = document.getElementById("cloud-auth-submit-btn");

      if (errBox) {
        errBox.textContent = "";
        errBox.classList.add("hidden");
      }
      if (emailInput && !emailInput.value && typeof AppState !== "undefined" && AppState.shopConfig && AppState.shopConfig.email) {
        emailInput.value = AppState.shopConfig.email;
      }
      if (passInput) {
        passInput.value = "";
        passInput.type = "password";
      }
      if (passConfirmInput) {
        passConfirmInput.value = "";
        passConfirmInput.type = "password";
      }

      // Reset íconos de ojito
      modal.querySelectorAll(".btn-toggle-password").forEach(btn => {
        const showIcon = btn.querySelector(".eye-icon-show");
        const hideIcon = btn.querySelector(".eye-icon-hide");
        if (showIcon) showIcon.classList.remove("hidden");
        if (hideIcon) hideIcon.classList.add("hidden");
        btn.setAttribute("aria-label", "Mostrar contraseña");
      });

      const targetTab = initialTab === "signup" ? "signup" : "login";
      modal.setAttribute("data-active-tab", targetTab);

      if (targetTab === "signup") {
        if (tabSignup) {
          tabSignup.classList.add("active");
          tabSignup.setAttribute("aria-selected", "true");
        }
        if (tabLogin) {
          tabLogin.classList.remove("active");
          tabLogin.setAttribute("aria-selected", "false");
        }
        if (confirmGroup) confirmGroup.classList.remove("hidden");
        if (submitBtn) submitBtn.textContent = "Crear Cuenta & Sincronizar";
      } else {
        if (tabLogin) {
          tabLogin.classList.add("active");
          tabLogin.setAttribute("aria-selected", "true");
        }
        if (tabSignup) {
          tabSignup.classList.remove("active");
          tabSignup.setAttribute("aria-selected", "false");
        }
        if (confirmGroup) confirmGroup.classList.add("hidden");
        if (submitBtn) submitBtn.textContent = "Iniciar Sesión";
      }

      modal.classList.remove("hidden");
      setTimeout(() => {
        if (emailInput && !emailInput.value) emailInput.focus();
        else if (passInput) passInput.focus();
      }, 50);
    },

    closeAuthModal() {
      const modal = document.getElementById("cloud-auth-modal");
      if (modal) modal.classList.add("hidden");
    },

    async openSuperAdminModal() {
      const modal = document.getElementById("superadmin-modal");
      if (!modal) return;

      const tbody = document.getElementById("superadmin-stores-tbody");
      const totalEl = document.getElementById("superadmin-total-stores");
      const activeEl = document.getElementById("superadmin-active-stores");

      if (tbody) tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:24px;">Cargando tiendas...</td></tr>`;
      modal.classList.remove("hidden");

      const res = await this.fetchAllStoresForAdmin();
      if (!res.ok) {
        if (tbody) tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:24px; color:#ef4444;">Error al cargar tiendas: ${res.error?.message || res.msg}</td></tr>`;
        return;
      }

      const stores = res.stores || [];
      if (totalEl) totalEl.textContent = stores.length;
      if (activeEl) activeEl.textContent = stores.filter(s => s.is_active).length;

      if (stores.length === 0) {
        if (tbody) tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:24px; color:var(--text-muted);">No hay tiendas registradas aún en Supabase.</td></tr>`;
        return;
      }

      if (tbody) {
        tbody.innerHTML = stores.map(s => {
          const isActive = s.is_active !== false;
          const dateStr = s.created_at ? new Date(s.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short" }) : "-";
          const publicUrl = `?tienda=${encodeURIComponent(s.slug)}`;

          return `
            <tr data-store-id="${s.id}">
              <td>
                <div style="font-weight:600; color:var(--text-main);">${escapeHtml(s.name)}</div>
                <div style="font-size:0.75rem; color:var(--text-muted); font-family:monospace;">/${escapeHtml(s.slug)}</div>
              </td>
              <td><span class="badge-niche-pill">${escapeHtml(s.preset || "general")}</span></td>
              <td>
                <span class="admin-status-badge ${isActive ? 'active' : 'suspended'}">
                  ${isActive ? '● Activa' : '○ Pausada'}
                </span>
              </td>
              <td>
                <div style="display:flex; align-items:center; gap:6px;">
                  <a href="${publicUrl}" target="_blank" class="admin-btn-action" title="Abrir vitrina">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                  <button type="button" class="admin-btn-toggle ${isActive ? 'btn-suspend' : 'btn-activate'}" 
                    onclick="CloudSync.handleToggleStore('${s.id}', ${!isActive})">
                    ${isActive ? 'Pausar' : 'Activar'}
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join("");
      }
    },

    closeSuperAdminModal() {
      const modal = document.getElementById("superadmin-modal");
      if (modal) modal.classList.add("hidden");
    },

    async handleToggleStore(storeId, newStatus) {
      const res = await this.toggleStoreStatus(storeId, newStatus);
      if (res.ok) {
        if (typeof Toast !== "undefined") Toast.show(`Tienda ${newStatus ? 'activada' : 'pausada'} con éxito`, "✅");
        this.openSuperAdminModal();
      } else {
        alert("Error al cambiar estado: " + (res.error?.message || res.msg));
      }
    }
  };

  window.CloudSync = CloudSync;

  // Auto-inicializar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => CloudSync.init());
  } else {
    CloudSync.init();
  }
})();
