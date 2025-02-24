<template>
  <nav id="sidebar" :class="{ collapsed: isCollapsed }">
    <div id="sidebar_content">
      <div id="user">
        <img src="@/assets/iconbolota.png" id="user_avatar" alt="Avatar" />
        <p id="user_infos">
          <span class="item-description">{{ user.name }}</span>
          <span class="item-description">{{ user.role }}</span>
        </p>
      </div>

      <ul id="side_items">
        <!-- Usando v-for para iterar sobre os itens do menu -->
        <li v-for="item in menuItems" :key="item.name" class="side-item" :class="{ active: activeItem === item.name }">
          <!-- Usando botão para navegação -->
          <button @click="navigate(item.route, item.name)" class="side-button">
            <font-awesome-icon :icon="item.icon" />
            <span class="item-description">{{ item.name }}</span>
          </button>
        </li>
      </ul>
    </div>

    <div id="logout">
      <button id="logout_btn" @click="logout">
        <font-awesome-icon icon="right-from-bracket" />
        <span class="item-description">Logout</span>
      </button>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,  // Controle de visibilidade do menu
      activeItem: 'Dashboard',  // Define o item ativo no menu
      user: {
        name: 'Administrador',
        role: 'Lorem Ipsum',
      },
      menuItems: [
        { name: 'Usuários', icon: ['fas', 'users'], route: '/' },
        { name: 'CSV', icon: ['fas', 'download'], route: '/import-csv' },
        { name: 'Menu', icon: ['fas', 'money-bill-transfer'], route: '/movements' },
        { name: 'Notificações', icon: ['fas', 'clipboard-list'], route: '/movementsModal' },
        { name: 'Produtos', icon: ['fas', 'coins'], route: '/credito' },
      ],
    };
  },
    methods: {
      toggleSidebar() {
        this.isCollapsed = !this.isCollapsed; // Alterna entre menu aberto e fechado
      },
      setActiveItem(itemName) {
        this.activeItem = itemName; // Define o item ativo
      },
      navigate(route, itemName) {
        console.log(this.$router); // Verifique se o Vue Router está acessível
        this.setActiveItem(itemName); // Define o item ativo antes de navegar
        if (this.$router) {
          this.$router.push(route); // Navega para a rota
        } else {
          console.error('Vue Router não disponível!');
        }
      },
      logout() {
        localStorage.clear();
        this.$router.push('/login');
      },
    }
  };
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  display: flex;
  min-height: 100vh;
  background-color: #e3e9f7;
}

#sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #ffffff;
  height: 100vh;
  border-radius: 0px 18px 18px 0px;
  position: fixed; /* Agora é fixo */
  top: 0; /* Fixa no topo da página */
  left: 0; /* Fixa no lado esquerdo */
  width: 82px; /* Largura inicial */
  z-index: 2;
  transition: all 0.5s;
}

#sidebar_content {
  padding: 12px;
}

#user {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

#user_avatar {
  width: 50px;
  height: 50px;
  object-fit: scale-down;
  border-radius: 10px;
}

#user_infos {
  display: flex;
  flex-direction: column;
}

#user_infos span:last-child {
  color: #6b6b6b;
  font-size: 12px;
}

#side_items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
}

.side-item {
  border-radius: 8px;
  padding: 14px;
  cursor: pointer;
}

.side-item.active {
  background-color: #4f46e5;
}

.side-item:hover:not(.active),
#logout_btn:hover {
  background-color: #e3e9f7;
}

.side-button {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: none;
  border: none;
  padding: 10px;
  color: #0a0a0a;
  font-size: 14px;
  cursor: pointer;
}

.side-item.active .side-button {
  color: #e3e9f7;
}

.side-item a i,
.side-button i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

#logout {
  border-top: 1px solid #e3e9f7;
  padding: 12px;
}

#logout_btn {
  border: none;
  padding: 12px;
  font-size: 14px;
  display: flex;
  gap: 20px;
  align-items: center;
  border-radius: 8px;
  text-align: start;
  cursor: pointer;
  background-color: transparent;
  color: #0a0a0a;
}

#open_btn {
  position: absolute;
  top: 50px;
  right: -10px;
  background-color: #4f46e5;
  color: #e3e9f7;
  border-radius: 100%;
  width: 20px;
  height: 15px;
  border: none;
  cursor: pointer;
}

#open_btn_icon {
  transition: transform 0.3s ease;
}

.open-sidebar #open_btn_icon {
  transform: rotate(180deg);
}

.item-description {
  width: 0px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
  transition: width 0.6s;
  height: 0px;
}

#sidebar.open-sidebar {
  width: 200px; /* Largura expandida */
}

#sidebar.open-sidebar .item-description {
  width: 150px;
  height: auto;
}

#sidebar.open-sidebar .side-item a {
  justify-content: flex-start;
  gap: 14px;
}

/* Ajuste do conteúdo principal */
main {
  padding: 20px;
  margin-left: 82px; /* Espaçamento à esquerda para não cobrir o conteúdo */
  z-index: 1;
}
</style>
