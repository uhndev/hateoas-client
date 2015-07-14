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
      { prompt: 'Form Builder', href: '/formbuilder', icon: 'fa-pencil-square-o' },
      { prompt: 'Workflow Editor', href: '/workflow', icon: 'fa-code' },
      { prompt: 'User Manager', href: '/user', icon: 'fa-user' },
      { prompt: 'Access Management', href: '/access', icon: 'fa-cog'}
    ]
  })

  .constant("SUBVIEW", {
    "SUBJECT": [ 'overview' ],
    "COORDINATOR": [ 'overview', 'subject', 'user' ],
    "PHYSICIAN": [ 'overview', 'subject', 'user' ],
    "INTERVIEWER": [ 'overview', 'subject' ],
    "ADMIN": [ 'overview', 'subject', 'user', 'form', 'survey', 'collectioncentre' ]
  });
  
})();
