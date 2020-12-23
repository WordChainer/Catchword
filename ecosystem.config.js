module.exports = {
    apps : [
        {
            name: 'app',
            script: 'app.js',
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
