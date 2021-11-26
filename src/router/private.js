export private {
    //#PR1 - Página Dashboard
    path: '/users/dashboard', 
    component: User,

    children: [ 

    //#PR2 - Página Criar Procedure
     { path: '/users/procedures/new', component: User , 
        children: [ 

            //#PR2.1 - Página Editar Descrição de Procedures
            { path: '/:username/:collection-slug/:procedure-slug/edit/description', component: User },

            //#PR2.2 - Página Editar Actions de Procedures
            { path: '/:username/:collection-slug/:procedure-slug/edit/actions', component: User },

            //#PR2.3 - Página Editar Phases de Procedures
            { path: '/:username/:collection-slug/:procedure-slug/edit/phases', component: User },
          ]
      },

    //#PR3 - Página Listar Procedures
    { path: '/users/procedures', component: User },
    
    //#PR4 - Página Editar Profile
    { path: '/users/profile', component: User },
  
    //#PR5 - Página Listar Cellections
    { path: '/users/collections', component: User },

    //#PR6 - Página Criar Collections
    { path: '/users/collections/new', component: User , 
      children: [ 

          //#PR6.1 - Página Editar Descrição de Collections
          { path: '/:username/:collection-slug/edit/description', component: User },

          //#PR6.2 - Página Editar Actions de Collections
          { path: '/:username/:collection-slug/edit/procedures', component: User },
        ]
    },
    
    //#PR7 - Página Listar Teams
    { path: '/users/teams', component: User },

    //#PR8 - Página Criar Teams
    { path: '/users/teams/new', component: User , 
      children: [ 

          //#PR8.1 - Página Editar Descrição de Teams
          { path: '/users/teams/:team-slug/description', component: User },

          //#PR8.2 - Página Editar Procedures de Teams
          { path: '/users/teams/:team-slug/members', component: User },
        ]
    },
    
    //#PR9 - Página Listar Favoritos
    { path: '/users/favourites', component: User },
]
};


