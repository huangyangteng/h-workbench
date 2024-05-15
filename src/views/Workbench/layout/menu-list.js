export const MENU_LIST = [
    {
        name: 'MY COLUMN',
        children: [
            { name: 'COLUMN LIST', route: '/workbench/column' },
            {
                name: 'RECENT COLUMN',
                route: '/workbench/recent-column'
            }
        ]
    },
    {
        name: 'MY VIDEO',
        children: [
            { name: 'VIDEO LIST', route: '/workbench/video' },
            {
                name: 'RECENT VIDEO',
                route: '/workbench/recent-video'
            }
        ]
    },
    {
        name: 'MY TOOLS',
        children: [
            { name: 'TOOLS LIST', route: '/workbench/tools' },
            { name: 'THINKING', route: '/thinking' }
        ],
        user: ['root', 'hyangteng']
    }
]
