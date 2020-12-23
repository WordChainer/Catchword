$(document).ready(function() {
    let $add = $('#add'),
        $delete = $('#delete'),
        $addList = $('#nav-add > textarea'),
        $deleteList = $('#nav-delete > textarea');

    $(window).on('resize', adjustSidebar);
    $(document).on('contextmenu dragstart selectstart', function(e) {
        return false;
    });
    $('body').tooltip({ selector: '[data-toggle="tooltip"]' });
    $('.sideMenuToggler').on('click', e => $('.wrapper').toggleClass('active'));
    $add.on('click', e => {
        let $this = $(e.currentTarget),
            html = $this.html(),
            words = $addList.val().match(/^[가-힣]{2,3}$/mg);

        if (!words) {
            alert('추가할 단어가 없습니다!');

            return;
        }

        if (confirm(`${words.join('\n')}\n\n개수: ${words.length}\n\n추가하시겠습니까?`)) {
            $this
                .prop('disabled', true)
                .html(`<i class="fa fa-spinner fa-spin"></i> 처리중`);
            $.post('/add', { 'words[]': JSON.stringify(words) }).done(res => {
                alert(res);
            }).catch(err => {
                alert(err.responseJSON.message);
            }).always(() => {
                $this
                    .prop('disabled', false)
                    .html(html);
            });
        }
    });
    $delete.on('click', e => {
        let $this = $(e.currentTarget),
            html = $this.html(),
            words = $deleteList.val().match(/^[가-힣]{2,3}$/mg);

        if (!words) {
            alert('삭제할 단어가 없습니다!');

            return;
        }

        if (confirm(`\n${words.join('\n')}\n\n개수: ${words.length}\n\n삭제시겠습니까?`)) {
            $this
                .prop('disabled', true)
                .html(`<i class="fa fa-spinner fa-spin"></i> 처리중`);
            $.post('/delete', { 'words[]': JSON.stringify(words) }).done(res => {
                alert(res);
            }).catch(err => {
                alert(err.responseJSON.message);
            }).always(() => {
                $this
                    .prop('disabled', false)
                    .html(html);
            });
        }
    });

    function adjustSidebar() {
        $('.sidebar').slimScroll({
            height: document.documentElement.clientHeight - $('.navbar').outerHeight()
        });
    }

    adjustSidebar();
});
