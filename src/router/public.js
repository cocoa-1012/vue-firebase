export public {
    //#PU1 - Página Inicial
    path: '/', 
    component: Default, 
      children: [
  
        //#PU2 - Página Busca
        { path: '/search/:searchData', component: User ,
            children: [ 
                    //#PU2.1 - Página Resultado da busca
                    { path: '/search/result/:searchData', component: User },
              ]
        },
  
        //#PU3 - Página Pública do Usuário
        { path: '/:username', component: User, 
        //(Página padrão 3.1)
            children: [ 
  
                    //#PU3.1 - Página pública do usuário procedures
                    { path: '/:username/procedures', component: User },
  
                    //#PU3.2 - Página pública do usuário collections
                    { path: '/:username/collections', component: User },
                  ] 
          },
  
        //#PU4 - Página Visualizar Collections
        { path: '/:username/:collection-slug', component: User,
          children: [ 
              //#PU4.1 - Página Descrição de Collections
              { path: '/:username/:collection-slug/description', component: User },
  
              //#PU4.2 - Página listar Procedures de Collections
              { path: '/:username/:collection-slug/procedures', component: User },
  
              //#PU4.3 - Página Visualizar Procedures
              { path: '/:username/:collection-slug/:procedure-slug', component: User ,
                children: [ 
  
                    //#PU4.3.1 - Página Descrição de Procedures
                    { path: '/:username/:collection-slug/:procedure-slug/description', component: User },
  
                    //#PU4.3.2 - Página Actions de Procedures
                    { path: '/:username/:collection-slug/:procedure-slug/actions', component: User },
  
                    //#PU4.3.3 - Página Phases de Procedures
                    { path: '/:username/:collection-slug/:procedure-slug/phases', component: User },
                  ]
              },
  
          ] 
        },
  
        //#PU5 - Página Visualizar Termos
        { path: '/terms', component: User },
      ]
  };
  