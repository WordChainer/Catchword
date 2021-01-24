module.exports = {
    apps : [
        {
            name: 'app',
            script: 'npm',
            args: 'start',
            watch: [
                'lib',
                'views',
                'src'
            ]
        },
        {
            name: 'gulp',
            script: 'gulp',
            args: 'watch'
        }
    ]
};
