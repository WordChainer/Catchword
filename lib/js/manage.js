$(document).ready(function() {
    let $ban = $('.ban');

    $ban.on('click', ban);

    function ban(e) {
        let $this = $(e.currentTarget),
            target = $this.data('target'),
            targetNickname = $this.parent().parent().find('.card-title').text();

        if (confirm(`[${targetNickname}]을(를) 차단하시겠습니까?`)) {
            $.post('/ban', { target }).done(res => {
                alert(res);
                location.reload();
            }).catch(err => {
                alert(err.responseJSON.message);
            });
        }
    }
});
