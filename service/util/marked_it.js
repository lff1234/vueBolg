const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const anchor = require('markdown-it-anchor');

const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        highlight: function(str, lang) {
            // 此处判断是否有添加代码语言
            if (lang && hljs.getLanguage(lang)) {
                try {
                    // 得到经过highlight.js之后的html代码
                    const preCode = hljs.highlight(str, { language: lang }).value;
                    // 以换行进行分割
                    const lines = preCode.split(/\n/).slice(0, -1);
                    // 添加自定义行号
                    let html = lines
                        .map((item, index) => {
                            return (
                                '<li><span class="line-num" data-line="' +
                                (index + 1) +
                                '"></span>' +
                                item +
                                '</li>'
                            );
                        })
                        .join('');
                    html = '<ol>' + html + '</ol>';
                    // 添加代码语言
                    if (lines.length) {
                        html += '<b class="name">' + lang + '</b>';
                    }
                    return '<pre class="hljs"><code>' + html + '</code></pre>';
                } catch (__) {}
            }
            // 未添加代码语言，此处与上面同理
            const preCode = md.utils.escapeHtml(str);
            const lines = preCode.split(/\n/).slice(0, -1);
            let html = lines
                .map((item, index) => {
                    return (
                        '<li><span class="line-num" data-line="' +
                        (index + 1) +
                        '"></span>' +
                        item +
                        '</li>'
                    );
                })
                .join('');
            html = '<ol>' + html + '</ol>';
            return '<pre class="hljs"><code>' + html + '</code></pre>';
        }
    })
    .use(anchor, {
        permalink: anchor.permalink.ariaHidden({
                placement: 'before'
            })
            // permalink: anchor.permalink.linkAfterHeader({
            //     style: 'visually-hidden',
            //     assistiveText: title => `"${title}"`,
            //     visuallyHiddenClass: 'visually-hidden',
            //     placement: 'before'
            // })
    })
    .use(require('markdown-it-toc-done-right'), {
        containerClass: 'toc', //生成的容器的类名，这样最后返回来的字符串是 <nav class="toc"><nav/>
        containerId: 'toc', //生成的容器的ID，这样最后返回来的字符串是 <nav id="toc"><nav/>
        listType: 'ul', //导航列表使用ul还是ol
        listClass: 'listClass', //li标签的样式名
        linkClass: 'linkClass', //a标签的样式名
        callback: function(html, ast) {
            //把目录单独列出来
            // html = 'split' + html + 'split';
        }
    });

// console.log(module.exports);
module.exports = md;