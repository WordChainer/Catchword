$(document).ready(function() {
    let $wrapper = $('body > .wrapper'),
        $user = $('#user'),
        $add = $('#add'),
        $delete = $('#delete'),
        $validate = $('#validate2'),
        $release = $('#release'),
        $deleteList = $('#nav-delete > textarea'),
        $validateList = $('#nav-validate > textarea'),
        $releaseList = $('#nav-release > textarea');

    $(window).on('resize', adjustSidebar);
    $(document).on('contextmenu dragstart selectstart', () => {
        return false;
    }).on('click', '.delete-field', e => {
        $(e.currentTarget).parent().parent().remove();
    });
    $('body').tooltip({ selector: '[data-toggle="tooltip"]' });
    $('.content').on('click', () => $wrapper.removeClass('active'));
    $('.sideMenuToggler').on('click', () => $wrapper.toggleClass('active'));
    $('.add-field').on('click', e => {
        $('<div>')
            .addClass('input-group mb-2').append(
                $('<div>').addClass('input-group-prepend').append(
                    $('<div>').addClass('input-group-text').append(
                        $('<input>').addClass('mr-1').attr('type', 'checkbox')
                    ).append($('<span>').text('숨김'))
                )
            ).append(
                $('<input>').addClass('form-control').attr('type', 'text')
            ).append(
                $('<div>').addClass('input-group-append').append(
                    $('<button>').addClass('btn btn-danger delete-field').append(
                        $('<i>').addClass('fa fa-trash')
                    )
                )
            ).insertBefore($(e.currentTarget));
    });
    $('.nav-link[href="/history"]').on('click', e => {
        if (!$user.length) {
            alert('로그인 후 이용가능합니다!');

            e.preventDefault();
        }
    });
    $add.on('click', e => {
        let $this = $(e.currentTarget),
            html = $this.html(),
            words = $('#nav-add .input-group').map((i, el) => {
                let $this = $(el),
                    $check = $this.find('input:checkbox:first'),
                    $word = $this.find('.form-control');

                return { isHidden: $check.is(':checked'), value: $word.val().trim() };
            })
            .get()
            .filter(word => /^[가-힣]{2,3}$/.test(word.value));

        if (words.length < 1) {
            alert('추가할 단어가 없습니다!');

            return;
        }

        if (confirm(`${words.map(word => word.value).join('\n')}\n\n개수: ${words.length}\n\n추가하시겠습니까?`)) {
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

        if (confirm(`\n${words.join('\n')}\n\n개수: ${words.length}\n\n삭제하시겠습니까?`)) {
            $this
                .prop('disabled', true)
                .html(`<i class="fa fa-spinner fa-spin"></i> 처리중`);
            $.post('/delete', { 'words[]': JSON.stringify(words) }).done(res => {
                alert(res);
                $deleteList.val('');
            }).catch(err => {
                alert(err.responseJSON.message);
            }).always(() => {
                $this
                    .prop('disabled', false)
                    .html(html);
            });
        }
    });
    $validate.on('click', e => {
        let $this = $(e.currentTarget),
            html = $this.html(),
            words = $validateList.val().match(/^[가-힣]{2,3}$/mg);

        if (!words) {
            alert('검수할 단어가 없습니다!');

            return;
        }

        if (confirm(`\n${words.join('\n')}\n\n개수: ${words.length}\n\n검수하시겠습니까?`)) {
            $this
                .prop('disabled', true)
                .html(`<i class="fa fa-spinner fa-spin"></i> 처리중`);
            $.post('/validate', { 'words[]': JSON.stringify(words) }).done(res => {
                alert(res);
                $validateList.val('');
            }).catch(err => {
                alert(err.responseJSON.message);
            }).always(() => {
                $this
                    .prop('disabled', false)
                    .html(html);
            });
        }
    });
    $release.on('click', e => {
        let $this = $(e.currentTarget),
            html = $this.html(),
            words = $releaseList.val().match(/^[가-힣]{2,3}$/mg);

        if (!words) {
            alert('공개할 단어가 없습니다!');

            return;
        }

        if (confirm(`\n${words.join('\n')}\n\n개수: ${words.length}\n\n공개하시겠습니까?`)) {
            $this
                .prop('disabled', true)
                .html(`<i class="fa fa-spinner fa-spin"></i> 처리중`);
            $.post('/release', { 'words[]': JSON.stringify(words) }).done(res => {
                alert(res);
                $releaseList.val('');
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
