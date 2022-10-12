import React from 'react';
import { Loading } from '@alifd/next';
import KeepAlive from 'react-activation';

function loadScript(urls, callback) {
  if (urls.length === 0 && callback) {
    callback();
    return;
  }
  const [id] = urls;

  if (document.getElementById(id)) {
    callback();
    return;
  }
  const script = document.createElement('script');
  script.type = 'text/javascript';
  [script.src] = urls;
  script.id = id;
  script.crossorigin = 'anonymous';
  script.onload = function () {
    loadScript(urls.slice(1), callback);
  };
  document.body.appendChild(script);
}

const Load = ({ schema = '', jsUrl = '', cssUrl = '', keepAlive = false }) => {
  class Load extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        v: true,
      };
    }

    componentDidMount = () => {
      if (!document.getElementById(cssUrl)) {
        const Link = document.createElement('link');
        Link.rel = 'stylesheet';
        Link.type = 'text/css';
        Link.href = cssUrl;
        Link.id = cssUrl;

        document.head.insertBefore(Link, document.head.getElementsByTagName('link')[0]);
      }

      if (!window.LeGao) {
        loadScript(
          [
            '//g.tryqcdn.com/code/lib/??react/16.13.0/umd/react.production.min.js,react-dom/16.13.0/umd/react-dom.production.min.js',
            '//g.tryqcdn.com/platform/c/??jquery/1.11.3/dist/jquery.min.js,react15-polyfill/0.0.1/dist/index.js,react-router/4.1.1/dist/umd/react-router.min.js,react-router-dom/4.2.2/umd/react-router-dom.min.js,lie/3.0.2/dist/lie.polyfill.min.js,lodash/4.6.1/lodash.min.js,immutable/3.7.6/dist/immutable.min.js,highcharts/5.0.12/highcharts.js,highcharts/5.0.12/highcharts-more.js,highcharts/5.0.12/modules/map.js,highcharts/5.0.12/modules/funnel.js,natty-storage/2.0.2/dist/natty-storage.min.js,natty-fetch/2.6.0/dist/natty-fetch.pc.min.js,tinymce/4.2.5/tinymce-full.js,prop-types/15.6.2/prop-types.js',
            '//g.tryqcdn.com/vision/render-engine/7.4.9/render-engine.min.js', // 渲染器
          ],
          () => {
            this.loadPage();
          },
        );
      } else {
        this.loadPage();
      }
    };

    loadPage() {
      loadScript(
        [
          jsUrl, // 生成的文件
        ],
        () => {
          try {
            // 富文本
            window.tinymce && window.tinymce.get().length > 0 && window.tinymce.remove();
          } catch (c) {}
          window.LeGao.createContext(
            {
              id: schema,
              schema, // 页面 formUuid or slug
            },
            () => {
              this.setState({
                v: false,
              });
            },
          ); // 第二个参数为可选的 callback
        },
      );
    }

    render() {
      const { v } = this.state;
      return (
        <Loading fullScreen visible={v}>
          <div id={schema} />
        </Loading>
      );
    }
  }

  return () => {
    const { pathname, search } = location;

    const key = `${pathname}${search}`;
    return (
      <KeepAlive name={key} id={key} key={key} when={keepAlive}>
        <Load />
      </KeepAlive>
    );
  };
};

export default Load;
