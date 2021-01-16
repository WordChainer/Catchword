module.exports = {
    apps : [
        {
            name: 'app',
            script: 'npm',
            args: 'run deploy',
            watch: [
                'lib',
                'views',
                'routes',
                'app.js'
            ]
        },
        {
            name: 'gulp',
            script: 'gulp',
            args: 'watch'
        }
    ]
};
