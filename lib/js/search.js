$(document).ready(function() {
    let $keyword = $('#keyword'),
        $search = $('#search'),
        $user = $('#user'),
        $loader = $('#loader'),
        $count = $('#count > b'),
        $validate = $('#validate'),
        $table = $('#result > tbody');

    $(document).ready(() => {
        $('#helper').popover({
            html: true,
            placement: 'bottom',
            trigger: 'focus',
            content: `
                <div>
                    <p class="mb-0">
                        <i class="fas fa-ban fa-fw align-middle mr-1 text-danger"></i>
                        <span>필터 필요</span>
                    </p>
                    <p class="d-inline mr-2 mb-0">
                        <i class="fas fa-skull fa-fw align-middle mr-1 text-success"></i>
                        <span>3-3 한방</span>
                    </p>
                    <p class="d-inline mb-0">
                        <i class="fas fa-crosshairs fa-fw align-middle mr-1 text-success"></i>
                        <span>3-3 미들</span>
                    </p>
                    <br>
                    <p class="d-inline mr-2 mb-0">
                        <i class="fas fa-skull fa-fw align-middle mr-1 text-primary"></i>
                        <span>3-2 한방</span>
                    </p>
                    <p class="d-inline mb-0">
                        <i class="fas fa-crosshairs fa-fw align-middle mr-1 text-primary"></i>
                        <span>3-2 미들</span>
                    </p>
                </div>
            `
        });
    });
    $keyword.on('keydown', e => {
        if (e.keyCode === 13) {
            search(e);
        }
    });
    $search.on('click', search);
    $validate.on('click', validate);

    function validate(e) {
        let $this = $(e.currentTarget),
            html = $this.html(),
            words = $('input[name="validate"]:checked').map((i, el) => {
                return $(el).val();
            })
            .get()
            .filter(word => /^[가-힣]{2,3}$/.test(word));

        if (words.length < 1) {
            alert('검수할 단어가 없습니다!');

            return;
        }

        if (confirm(`\n${words.join('\n')}\n\n개수: ${words.length}\n\n검수하시겠습니까?`)) {
            $this
                .prop('disabled', true)
                .html(`<i class="fa fa-spinner fa-spin"></i> 처리중`);
            $.post('/validate', { 'words[]': JSON.stringify(words) }).done(res => {
                alert(res);
            }).catch(err => {
                alert(err.responseJSON.message);
            }).always(() => {
                $this
                    .prop('disabled', false)
                    .html(html);
            });
        }
    }

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
            words = words.map(word => {
                let {
                    value,
                    date,
                    user,
                    needFilter,
                    isHanbang33,
                    isHanbang32,
                    isMiddle33,
                    isMiddle32,
                    isHidden,
                    isValidated
                } = word;
                let timestamp = dayjs(date).format('YYYY년 MM월 DD일<br>HH시 mm분 ss초');
                let marks = [];

                if (needFilter) {
                    marks.push('<i class="fas fa-ban text-danger"></i>');
                }

                if (isHanbang33) {
                    marks.push('<i class="fas fa-skull text-success"></i>');
                }

                if (isHanbang32) {
                    marks.push('<i class="fas fa-skull text-primary"></i>');
                }

                if (isMiddle33) {
                    marks.push('<i class="fas fa-crosshairs text-success"></i>');
                }

                if (isMiddle32) {
                    marks.push('<i class="fas fa-crosshairs text-primary"></i>');
                }

                let hasMarks = marks.length > 0,
                    marksHtml = hasMarks ? `<div class="mt-1 mb-n1 marks">${marks.join('')}</div>` : '',
                    valueHtml = isHidden ? `<span class="font-weight-bold text-danger">${value}</span>` : value;

                return `
                    <tr>
                        <td style="width: 3%;">
                            ${isValidated ? '<i class="text-success fas fa-check"></i>' : `<input type="checkbox" name="validate" value="${value}">`}
                        </td>
                        <td class="${['', 'py-0'][+hasMarks]}">${marksHtml}${valueHtml}</td>
                        <td>${user.nickname}</td>
                        <td>
                            <span class="date" data-toggle="tooltip" data-html="true" title="${timestamp}">${date.slice(0, 10)}</span>
                        </td>
                    </tr>
                `;
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
