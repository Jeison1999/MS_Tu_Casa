import { trigger, transition, style, query, animate } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'scale(0.96) translateY(10px)',
          transformOrigin: 'top center',
          filter: 'blur(4px)',
        }),
        animate(
          '260ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({
            opacity: 1,
            transform: 'scale(1) translateY(0px)',
            filter: 'blur(0px)',
          })
        ),
      ],
      { optional: true }
    ),
  ]),
]);

