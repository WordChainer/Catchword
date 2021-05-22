module.exports = {
    apps : [
        {
            name: 'app',
            script: 'npm',
            args: 'start',
            watch: [
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
