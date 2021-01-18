$(document).ready(function() {
    let $keyword = $('#keyword'),
        $search = $('#search'),
        $user = $('#user'),
        $loader = $('#loader'),
        $count = $('#count > b'),
        $table = $('#result > tbody');

    $keyword.on('keydown', e => {
        if (e.keyCode === 13) {
            search(e);
        }
    });
    $search.on('click', search);

    function search(e) {
        let keyword = $keyword.val().trim(),
            length = $('input[name="wordLength"]:checked').val();

        if (!$user.length) {
            alert('로그인 후 이용가능합니다!');

            return false;
        }
        
        if (keyword === '' || /^\.+$/.test(keyword)) {
            initialize();

            return false;
        }

        e.preventDefault();
        
        $loader.modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });
        $.post('/search', { keyword, length }).done(words => {
            words = words.map(({ value, date, user, isHidden }) => {
                return `<tr class="${['', 'bg-danger'][+isHidden]}"><td>${value}</td><td>${user.nickname}</td><td><span data-toggle="tooltip" data-html="true" title="${moment(date).format('YYYY년 MM월 DD일<br>HH시 mm분 ss초')}">${date.slice(0, 10)}</span></td></tr>`;
            });

            $count.text(words.length);
            $table.empty().append(words.join(''));
        }).catch(err => {
            alert(err.responseJSON.message);
        }).always(() => {
            $loader.modal('hide');
            initialize();
        });
    }

    function initialize() {
        $keyword.val('').focus();
    }
});
