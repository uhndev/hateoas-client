(function() {
  'use strict';
  angular.module('dados.header.constants', [])

  .constant("TABVIEW", {
    "SUBJECT": [
      { prompt: 'My Studies', href: '/study', icon: 'fa-group' },
      { prompt: 'My Profile', href: '/user', icon: 'fa-user' }
    ],
    "COORDINATOR": [
      { prompt: 'Studies', href: '/study', icon: 'fa-group' },
      { prompt: 'User Manager', href: '/user', icon: 'fa-user' }
    ],
    "PHYSICIAN": [
      { prompt: 'Studies', href: '/study', icon: 'fa-group' },
      { prompt: 'My Profile', href: '/user', icon: 'fa-user' }
    ],
    "INTERVIEWER": [
      { prompt: 'Studies', href: '/study', icon: 'fa-group' },
      { prompt: 'My Profile', href: '/user', icon: 'fa-user' }
    ],
    "ADMIN": [
      { prompt: 'Studies', href: '/study', icon: 'fa-group' },
      { prompt: 'User Manager', href: '/user', icon: 'fa-user' },
      { prompt: 'Tools', icon: 'fa-cog', dropdown: [
        { prompt: 'Form Builder', href: '/formbuilder', icon: 'fa-pencil-square-o' },
        { prompt: 'Workflow Editor', href: '/workflow', icon: 'fa-code' },
        { prompt: 'Groups', href: '/group', icon: 'fa-users'},
        { prompt: 'Access Management', href: '/access', icon: 'fa-lock'}
      ]}
    ]
  })

  .constant("SUBVIEW", {
    "SUBJECT": [ 'name', 'overview' ],
    "COORDINATOR": [ 'name', 'overview', 'subject', 'user' ],
    "INTERVIEWER": [ 'name', 'overview', 'subject' ],
    "ADMIN": [ 'name', 'overview', 'collectioncentre', 'subject', 'user', 'form', 'survey' ]
  });

})();
