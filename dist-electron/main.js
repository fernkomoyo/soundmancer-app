import Lt, { app as $e, globalShortcut as eo, BrowserWindow as vo, protocol as Uf, ipcMain as be, shell as kf, dialog as Mf } from "electron";
import { fileURLToPath as Bf } from "node:url";
import ee from "node:path";
import J from "node:fs";
import nt from "fs";
import jf from "constants";
import ar from "stream";
import wo from "util";
import wl from "assert";
import ie from "path";
import Gr from "child_process";
import _o from "events";
import Wr from "crypto";
import _l from "tty";
import Vr from "os";
import sr from "url";
import Hf from "string_decoder";
import Sl from "zlib";
import qf from "http";
import Gf from "https";
import { createRequire as Wf } from "node:module";
var le = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, tt = {}, kt = {}, Ie = {};
Ie.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, o) => i != null ? n(i) : r(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Ie.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var ct = jf, Vf = process.cwd, Rn = null, Yf = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Rn || (Rn = Vf.call(process)), Rn;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Ea = process.chdir;
  process.chdir = function(e) {
    Rn = null, Ea.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Ea);
}
var zf = Xf;
function Xf(e) {
  ct.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, p) {
    p && process.nextTick(p);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, p, g) {
    g && process.nextTick(g);
  }, e.lchownSync = function() {
  }), Yf === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function f(p, g, _) {
      var E = Date.now(), S = 0;
      c(p, g, function A(T) {
        if (T && (T.code === "EACCES" || T.code === "EPERM" || T.code === "EBUSY") && Date.now() - E < 6e4) {
          setTimeout(function() {
            e.stat(g, function($, x) {
              $ && $.code === "ENOENT" ? c(p, g, A) : _(T);
            });
          }, S), S < 100 && (S += 10);
          return;
        }
        _ && _(T);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function f(p, g, _, E, S, A) {
      var T;
      if (A && typeof A == "function") {
        var $ = 0;
        T = function(x, te, se) {
          if (x && x.code === "EAGAIN" && $ < 10)
            return $++, c.call(e, p, g, _, E, S, T);
          A.apply(this, arguments);
        };
      }
      return c.call(e, p, g, _, E, S, T);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(f, p, g, _, E) {
      for (var S = 0; ; )
        try {
          return c.call(e, f, p, g, _, E);
        } catch (A) {
          if (A.code === "EAGAIN" && S < 10) {
            S++;
            continue;
          }
          throw A;
        }
    };
  }(e.readSync);
  function t(c) {
    c.lchmod = function(f, p, g) {
      c.open(
        f,
        ct.O_WRONLY | ct.O_SYMLINK,
        p,
        function(_, E) {
          if (_) {
            g && g(_);
            return;
          }
          c.fchmod(E, p, function(S) {
            c.close(E, function(A) {
              g && g(S || A);
            });
          });
        }
      );
    }, c.lchmodSync = function(f, p) {
      var g = c.openSync(f, ct.O_WRONLY | ct.O_SYMLINK, p), _ = !0, E;
      try {
        E = c.fchmodSync(g, p), _ = !1;
      } finally {
        if (_)
          try {
            c.closeSync(g);
          } catch {
          }
        else
          c.closeSync(g);
      }
      return E;
    };
  }
  function r(c) {
    ct.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(f, p, g, _) {
      c.open(f, ct.O_SYMLINK, function(E, S) {
        if (E) {
          _ && _(E);
          return;
        }
        c.futimes(S, p, g, function(A) {
          c.close(S, function(T) {
            _ && _(A || T);
          });
        });
      });
    }, c.lutimesSync = function(f, p, g) {
      var _ = c.openSync(f, ct.O_SYMLINK), E, S = !0;
      try {
        E = c.futimesSync(_, p, g), S = !1;
      } finally {
        if (S)
          try {
            c.closeSync(_);
          } catch {
          }
        else
          c.closeSync(_);
      }
      return E;
    }) : c.futimes && (c.lutimes = function(f, p, g, _) {
      _ && process.nextTick(_);
    }, c.lutimesSync = function() {
    });
  }
  function n(c) {
    return c && function(f, p, g) {
      return c.call(e, f, p, function(_) {
        d(_) && (_ = null), g && g.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(f, p) {
      try {
        return c.call(e, f, p);
      } catch (g) {
        if (!d(g)) throw g;
      }
    };
  }
  function o(c) {
    return c && function(f, p, g, _) {
      return c.call(e, f, p, g, function(E) {
        d(E) && (E = null), _ && _.apply(this, arguments);
      });
    };
  }
  function a(c) {
    return c && function(f, p, g) {
      try {
        return c.call(e, f, p, g);
      } catch (_) {
        if (!d(_)) throw _;
      }
    };
  }
  function s(c) {
    return c && function(f, p, g) {
      typeof p == "function" && (g = p, p = null);
      function _(E, S) {
        S && (S.uid < 0 && (S.uid += 4294967296), S.gid < 0 && (S.gid += 4294967296)), g && g.apply(this, arguments);
      }
      return p ? c.call(e, f, p, _) : c.call(e, f, _);
    };
  }
  function l(c) {
    return c && function(f, p) {
      var g = p ? c.call(e, f, p) : c.call(e, f);
      return g && (g.uid < 0 && (g.uid += 4294967296), g.gid < 0 && (g.gid += 4294967296)), g;
    };
  }
  function d(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var va = ar.Stream, Kf = Jf;
function Jf(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    va.call(this);
    var o = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var a = Object.keys(i), s = 0, l = a.length; s < l; s++) {
      var d = a[s];
      this[d] = i[d];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(c, f) {
      if (c) {
        o.emit("error", c), o.readable = !1;
        return;
      }
      o.fd = f, o.emit("open", f), o._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    va.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), a = 0, s = o.length; a < s; a++) {
      var l = o[a];
      this[l] = i[l];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var Qf = ed, Zf = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function ed(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Zf(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var ne = nt, td = zf, rd = Kf, nd = Qf, pn = wo, ve, Fn;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (ve = Symbol.for("graceful-fs.queue"), Fn = Symbol.for("graceful-fs.previous")) : (ve = "___graceful-fs.queue", Fn = "___graceful-fs.previous");
function id() {
}
function Al(e, t) {
  Object.defineProperty(e, ve, {
    get: function() {
      return t;
    }
  });
}
var Ft = id;
pn.debuglog ? Ft = pn.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Ft = function() {
  var e = pn.format.apply(pn, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!ne[ve]) {
  var od = le[ve] || [];
  Al(ne, od), ne.close = function(e) {
    function t(r, n) {
      return e.call(ne, r, function(i) {
        i || wa(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Fn, {
      value: e
    }), t;
  }(ne.close), ne.closeSync = function(e) {
    function t(r) {
      e.apply(ne, arguments), wa();
    }
    return Object.defineProperty(t, Fn, {
      value: e
    }), t;
  }(ne.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Ft(ne[ve]), wl.equal(ne[ve].length, 0);
  });
}
le[ve] || Al(le, ne[ve]);
var Re = So(nd(ne));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !ne.__patched && (Re = So(ne), ne.__patched = !0);
function So(e) {
  td(e), e.gracefulify = So, e.createReadStream = te, e.createWriteStream = se;
  var t = e.readFile;
  e.readFile = r;
  function r(y, q, B) {
    return typeof q == "function" && (B = q, q = null), M(y, q, B);
    function M(z, I, O, D) {
      return t(z, I, function(C) {
        C && (C.code === "EMFILE" || C.code === "ENFILE") ? Ht([M, [z, I, O], C, D || Date.now(), Date.now()]) : typeof O == "function" && O.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(y, q, B, M) {
    return typeof B == "function" && (M = B, B = null), z(y, q, B, M);
    function z(I, O, D, C, N) {
      return n(I, O, D, function(R) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Ht([z, [I, O, D, C], R, N || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(y, q, B, M) {
    return typeof B == "function" && (M = B, B = null), z(y, q, B, M);
    function z(I, O, D, C, N) {
      return o(I, O, D, function(R) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Ht([z, [I, O, D, C], R, N || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(y, q, B, M) {
    return typeof B == "function" && (M = B, B = 0), z(y, q, B, M);
    function z(I, O, D, C, N) {
      return s(I, O, D, function(R) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Ht([z, [I, O, D, C], R, N || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var d = e.readdir;
  e.readdir = f;
  var c = /^v[0-5]\./;
  function f(y, q, B) {
    typeof q == "function" && (B = q, q = null);
    var M = c.test(process.version) ? function(O, D, C, N) {
      return d(O, z(
        O,
        D,
        C,
        N
      ));
    } : function(O, D, C, N) {
      return d(O, D, z(
        O,
        D,
        C,
        N
      ));
    };
    return M(y, q, B);
    function z(I, O, D, C) {
      return function(N, R) {
        N && (N.code === "EMFILE" || N.code === "ENFILE") ? Ht([
          M,
          [I, O, D],
          N,
          C || Date.now(),
          Date.now()
        ]) : (R && R.sort && R.sort(), typeof D == "function" && D.call(this, N, R));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var p = rd(e);
    A = p.ReadStream, $ = p.WriteStream;
  }
  var g = e.ReadStream;
  g && (A.prototype = Object.create(g.prototype), A.prototype.open = T);
  var _ = e.WriteStream;
  _ && ($.prototype = Object.create(_.prototype), $.prototype.open = x), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return A;
    },
    set: function(y) {
      A = y;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return $;
    },
    set: function(y) {
      $ = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var E = A;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return E;
    },
    set: function(y) {
      E = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var S = $;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return S;
    },
    set: function(y) {
      S = y;
    },
    enumerable: !0,
    configurable: !0
  });
  function A(y, q) {
    return this instanceof A ? (g.apply(this, arguments), this) : A.apply(Object.create(A.prototype), arguments);
  }
  function T() {
    var y = this;
    Le(y.path, y.flags, y.mode, function(q, B) {
      q ? (y.autoClose && y.destroy(), y.emit("error", q)) : (y.fd = B, y.emit("open", B), y.read());
    });
  }
  function $(y, q) {
    return this instanceof $ ? (_.apply(this, arguments), this) : $.apply(Object.create($.prototype), arguments);
  }
  function x() {
    var y = this;
    Le(y.path, y.flags, y.mode, function(q, B) {
      q ? (y.destroy(), y.emit("error", q)) : (y.fd = B, y.emit("open", B));
    });
  }
  function te(y, q) {
    return new e.ReadStream(y, q);
  }
  function se(y, q) {
    return new e.WriteStream(y, q);
  }
  var V = e.open;
  e.open = Le;
  function Le(y, q, B, M) {
    return typeof B == "function" && (M = B, B = null), z(y, q, B, M);
    function z(I, O, D, C, N) {
      return V(I, O, D, function(R, k) {
        R && (R.code === "EMFILE" || R.code === "ENFILE") ? Ht([z, [I, O, D, C], R, N || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  return e;
}
function Ht(e) {
  Ft("ENQUEUE", e[0].name, e[1]), ne[ve].push(e), Ao();
}
var mn;
function wa() {
  for (var e = Date.now(), t = 0; t < ne[ve].length; ++t)
    ne[ve][t].length > 2 && (ne[ve][t][3] = e, ne[ve][t][4] = e);
  Ao();
}
function Ao() {
  if (clearTimeout(mn), mn = void 0, ne[ve].length !== 0) {
    var e = ne[ve].shift(), t = e[0], r = e[1], n = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Ft("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Ft("TIMEOUT", t.name, r);
      var a = r.pop();
      typeof a == "function" && a.call(null, n);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), d = Math.min(l * 1.2, 100);
      s >= d ? (Ft("RETRY", t.name, r), t.apply(null, r.concat([i]))) : ne[ve].push(e);
    }
    mn === void 0 && (mn = setTimeout(Ao, 0));
  }
}
(function(e) {
  const t = Ie.fromCallback, r = Re, n = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof r[i] == "function");
  Object.assign(e, r), n.forEach((i) => {
    e[i] = t(r[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? r.exists(i, o) : new Promise((a) => r.exists(i, a));
  }, e.read = function(i, o, a, s, l, d) {
    return typeof d == "function" ? r.read(i, o, a, s, l, d) : new Promise((c, f) => {
      r.read(i, o, a, s, l, (p, g, _) => {
        if (p) return f(p);
        c({ bytesRead: g, buffer: _ });
      });
    });
  }, e.write = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? r.write(i, o, ...a) : new Promise((s, l) => {
      r.write(i, o, ...a, (d, c, f) => {
        if (d) return l(d);
        s({ bytesWritten: c, buffer: f });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? r.writev(i, o, ...a) : new Promise((s, l) => {
      r.writev(i, o, ...a, (d, c, f) => {
        if (d) return l(d);
        s({ bytesWritten: c, buffers: f });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(kt);
var To = {}, Tl = {};
const ad = ie;
Tl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(ad.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const bl = kt, { checkPath: Cl } = Tl, Ol = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
To.makeDir = async (e, t) => (Cl(e), bl.mkdir(e, {
  mode: Ol(t),
  recursive: !0
}));
To.makeDirSync = (e, t) => (Cl(e), bl.mkdirSync(e, {
  mode: Ol(t),
  recursive: !0
}));
const sd = Ie.fromPromise, { makeDir: ld, makeDirSync: Ai } = To, Ti = sd(ld);
var Je = {
  mkdirs: Ti,
  mkdirsSync: Ai,
  // alias
  mkdirp: Ti,
  mkdirpSync: Ai,
  ensureDir: Ti,
  ensureDirSync: Ai
};
const cd = Ie.fromPromise, Pl = kt;
function ud(e) {
  return Pl.access(e).then(() => !0).catch(() => !1);
}
var Mt = {
  pathExists: cd(ud),
  pathExistsSync: Pl.existsSync
};
const er = Re;
function fd(e, t, r, n) {
  er.open(e, "r+", (i, o) => {
    if (i) return n(i);
    er.futimes(o, t, r, (a) => {
      er.close(o, (s) => {
        n && n(a || s);
      });
    });
  });
}
function dd(e, t, r) {
  const n = er.openSync(e, "r+");
  return er.futimesSync(n, t, r), er.closeSync(n);
}
var Il = {
  utimesMillis: fd,
  utimesMillisSync: dd
};
const rr = kt, me = ie, hd = wo;
function pd(e, t, r) {
  const n = r.dereference ? (i) => rr.stat(i, { bigint: !0 }) : (i) => rr.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function md(e, t, r) {
  let n;
  const i = r.dereference ? (a) => rr.statSync(a, { bigint: !0 }) : (a) => rr.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    n = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: n };
}
function gd(e, t, r, n, i) {
  hd.callbackify(pd)(e, t, n, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (Yr(s, l)) {
        const d = me.basename(e), c = me.basename(t);
        return r === "move" && d !== c && d.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && bo(e, t) ? i(new Error(Vn(e, t, r))) : i(null, { srcStat: s, destStat: l });
  });
}
function yd(e, t, r, n) {
  const { srcStat: i, destStat: o } = md(e, t, n);
  if (o) {
    if (Yr(i, o)) {
      const a = me.basename(e), s = me.basename(t);
      if (r === "move" && a !== s && a.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && bo(e, t))
    throw new Error(Vn(e, t, r));
  return { srcStat: i, destStat: o };
}
function Rl(e, t, r, n, i) {
  const o = me.resolve(me.dirname(e)), a = me.resolve(me.dirname(r));
  if (a === o || a === me.parse(a).root) return i();
  rr.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : Yr(t, l) ? i(new Error(Vn(e, r, n))) : Rl(e, t, a, n, i));
}
function Dl(e, t, r, n) {
  const i = me.resolve(me.dirname(e)), o = me.resolve(me.dirname(r));
  if (o === i || o === me.parse(o).root) return;
  let a;
  try {
    a = rr.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (Yr(t, a))
    throw new Error(Vn(e, r, n));
  return Dl(e, t, o, n);
}
function Yr(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function bo(e, t) {
  const r = me.resolve(e).split(me.sep).filter((i) => i), n = me.resolve(t).split(me.sep).filter((i) => i);
  return r.reduce((i, o, a) => i && n[a] === o, !0);
}
function Vn(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var lr = {
  checkPaths: gd,
  checkPathsSync: yd,
  checkParentPaths: Rl,
  checkParentPathsSync: Dl,
  isSrcSubdir: bo,
  areIdentical: Yr
};
const Fe = Re, Ir = ie, Ed = Je.mkdirs, vd = Mt.pathExists, wd = Il.utimesMillis, Rr = lr;
function _d(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Rr.checkPaths(e, t, "copy", r, (i, o) => {
    if (i) return n(i);
    const { srcStat: a, destStat: s } = o;
    Rr.checkParentPaths(e, a, t, "copy", (l) => l ? n(l) : r.filter ? Nl(_a, s, e, t, r, n) : _a(s, e, t, r, n));
  });
}
function _a(e, t, r, n, i) {
  const o = Ir.dirname(r);
  vd(o, (a, s) => {
    if (a) return i(a);
    if (s) return xn(e, t, r, n, i);
    Ed(o, (l) => l ? i(l) : xn(e, t, r, n, i));
  });
}
function Nl(e, t, r, n, i, o) {
  Promise.resolve(i.filter(r, n)).then((a) => a ? e(t, r, n, i, o) : o(), (a) => o(a));
}
function Sd(e, t, r, n, i) {
  return n.filter ? Nl(xn, e, t, r, n, i) : xn(e, t, r, n, i);
}
function xn(e, t, r, n, i) {
  (n.dereference ? Fe.stat : Fe.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? Id(s, e, t, r, n, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? Ad(s, e, t, r, n, i) : s.isSymbolicLink() ? Nd(e, t, r, n, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Ad(e, t, r, n, i, o) {
  return t ? Td(e, r, n, i, o) : $l(e, r, n, i, o);
}
function Td(e, t, r, n, i) {
  if (n.overwrite)
    Fe.unlink(r, (o) => o ? i(o) : $l(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function $l(e, t, r, n, i) {
  Fe.copyFile(t, r, (o) => o ? i(o) : n.preserveTimestamps ? bd(e.mode, t, r, i) : Yn(r, e.mode, i));
}
function bd(e, t, r, n) {
  return Cd(e) ? Od(r, e, (i) => i ? n(i) : Sa(e, t, r, n)) : Sa(e, t, r, n);
}
function Cd(e) {
  return (e & 128) === 0;
}
function Od(e, t, r) {
  return Yn(e, t | 128, r);
}
function Sa(e, t, r, n) {
  Pd(t, r, (i) => i ? n(i) : Yn(r, e, n));
}
function Yn(e, t, r) {
  return Fe.chmod(e, t, r);
}
function Pd(e, t, r) {
  Fe.stat(e, (n, i) => n ? r(n) : wd(t, i.atime, i.mtime, r));
}
function Id(e, t, r, n, i, o) {
  return t ? Fl(r, n, i, o) : Rd(e.mode, r, n, i, o);
}
function Rd(e, t, r, n, i) {
  Fe.mkdir(r, (o) => {
    if (o) return i(o);
    Fl(t, r, n, (a) => a ? i(a) : Yn(r, e, i));
  });
}
function Fl(e, t, r, n) {
  Fe.readdir(e, (i, o) => i ? n(i) : xl(o, e, t, r, n));
}
function xl(e, t, r, n, i) {
  const o = e.pop();
  return o ? Dd(e, o, t, r, n, i) : i();
}
function Dd(e, t, r, n, i, o) {
  const a = Ir.join(r, t), s = Ir.join(n, t);
  Rr.checkPaths(a, s, "copy", i, (l, d) => {
    if (l) return o(l);
    const { destStat: c } = d;
    Sd(c, a, s, i, (f) => f ? o(f) : xl(e, r, n, i, o));
  });
}
function Nd(e, t, r, n, i) {
  Fe.readlink(t, (o, a) => {
    if (o) return i(o);
    if (n.dereference && (a = Ir.resolve(process.cwd(), a)), e)
      Fe.readlink(r, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? Fe.symlink(a, r, i) : i(s) : (n.dereference && (l = Ir.resolve(process.cwd(), l)), Rr.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && Rr.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : $d(a, r, i)));
    else
      return Fe.symlink(a, r, i);
  });
}
function $d(e, t, r) {
  Fe.unlink(t, (n) => n ? r(n) : Fe.symlink(e, t, r));
}
var Fd = _d;
const Ae = Re, Dr = ie, xd = Je.mkdirsSync, Ld = Il.utimesMillisSync, Nr = lr;
function Ud(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Nr.checkPathsSync(e, t, "copy", r);
  return Nr.checkParentPathsSync(e, n, t, "copy"), kd(i, e, t, r);
}
function kd(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Dr.dirname(r);
  return Ae.existsSync(i) || xd(i), Ll(e, t, r, n);
}
function Md(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return Ll(e, t, r, n);
}
function Ll(e, t, r, n) {
  const o = (n.dereference ? Ae.statSync : Ae.lstatSync)(t);
  if (o.isDirectory()) return Vd(o, e, t, r, n);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return Bd(o, e, t, r, n);
  if (o.isSymbolicLink()) return Xd(e, t, r, n);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function Bd(e, t, r, n, i) {
  return t ? jd(e, r, n, i) : Ul(e, r, n, i);
}
function jd(e, t, r, n) {
  if (n.overwrite)
    return Ae.unlinkSync(r), Ul(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function Ul(e, t, r, n) {
  return Ae.copyFileSync(t, r), n.preserveTimestamps && Hd(e.mode, t, r), Co(r, e.mode);
}
function Hd(e, t, r) {
  return qd(e) && Gd(r, e), Wd(t, r);
}
function qd(e) {
  return (e & 128) === 0;
}
function Gd(e, t) {
  return Co(e, t | 128);
}
function Co(e, t) {
  return Ae.chmodSync(e, t);
}
function Wd(e, t) {
  const r = Ae.statSync(e);
  return Ld(t, r.atime, r.mtime);
}
function Vd(e, t, r, n, i) {
  return t ? kl(r, n, i) : Yd(e.mode, r, n, i);
}
function Yd(e, t, r, n) {
  return Ae.mkdirSync(r), kl(t, r, n), Co(r, e);
}
function kl(e, t, r) {
  Ae.readdirSync(e).forEach((n) => zd(n, e, t, r));
}
function zd(e, t, r, n) {
  const i = Dr.join(t, e), o = Dr.join(r, e), { destStat: a } = Nr.checkPathsSync(i, o, "copy", n);
  return Md(a, i, o, n);
}
function Xd(e, t, r, n) {
  let i = Ae.readlinkSync(t);
  if (n.dereference && (i = Dr.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Ae.readlinkSync(r);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return Ae.symlinkSync(i, r);
      throw a;
    }
    if (n.dereference && (o = Dr.resolve(process.cwd(), o)), Nr.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Ae.statSync(r).isDirectory() && Nr.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return Kd(i, r);
  } else
    return Ae.symlinkSync(i, r);
}
function Kd(e, t) {
  return Ae.unlinkSync(t), Ae.symlinkSync(e, t);
}
var Jd = Ud;
const Qd = Ie.fromCallback;
var Oo = {
  copy: Qd(Fd),
  copySync: Jd
};
const Aa = Re, Ml = ie, K = wl, $r = process.platform === "win32";
function Bl(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || Aa[r], r = r + "Sync", e[r] = e[r] || Aa[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Po(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), K(e, "rimraf: missing path"), K.strictEqual(typeof e, "string", "rimraf: path should be a string"), K.strictEqual(typeof r, "function", "rimraf: callback function required"), K(t, "rimraf: invalid options argument provided"), K.strictEqual(typeof t, "object", "rimraf: options should be object"), Bl(t), Ta(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const a = n * 100;
        return setTimeout(() => Ta(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    r(o);
  });
}
function Ta(e, t, r) {
  K(e), K(t), K(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && $r)
      return ba(e, t, n, r);
    if (i && i.isDirectory())
      return Dn(e, t, n, r);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return r(null);
        if (o.code === "EPERM")
          return $r ? ba(e, t, o, r) : Dn(e, t, o, r);
        if (o.code === "EISDIR")
          return Dn(e, t, o, r);
      }
      return r(o);
    });
  });
}
function ba(e, t, r, n) {
  K(e), K(t), K(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (o, a) => {
      o ? n(o.code === "ENOENT" ? null : r) : a.isDirectory() ? Dn(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Ca(e, t, r) {
  let n;
  K(e), K(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  try {
    n = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  n.isDirectory() ? Nn(e, t, r) : t.unlinkSync(e);
}
function Dn(e, t, r, n) {
  K(e), K(t), K(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Zd(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Zd(e, t, r) {
  K(e), K(t), K(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, r);
    i.forEach((s) => {
      Po(Ml.join(e, s), t, (l) => {
        if (!a) {
          if (l) return r(a = l);
          --o === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function jl(e, t) {
  let r;
  t = t || {}, Bl(t), K(e, "rimraf: missing path"), K.strictEqual(typeof e, "string", "rimraf: path should be a string"), K(t, "rimraf: missing options"), K.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && $r && Ca(e, t, n);
  }
  try {
    r && r.isDirectory() ? Nn(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return $r ? Ca(e, t, n) : Nn(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    Nn(e, t, n);
  }
}
function Nn(e, t, r) {
  K(e), K(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      eh(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function eh(e, t) {
  if (K(e), K(t), t.readdirSync(e).forEach((r) => jl(Ml.join(e, r), t)), $r) {
    const r = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - r < 500);
  } else
    return t.rmdirSync(e, t);
}
var th = Po;
Po.sync = jl;
const Ln = Re, rh = Ie.fromCallback, Hl = th;
function nh(e, t) {
  if (Ln.rm) return Ln.rm(e, { recursive: !0, force: !0 }, t);
  Hl(e, t);
}
function ih(e) {
  if (Ln.rmSync) return Ln.rmSync(e, { recursive: !0, force: !0 });
  Hl.sync(e);
}
var zn = {
  remove: rh(nh),
  removeSync: ih
};
const oh = Ie.fromPromise, ql = kt, Gl = ie, Wl = Je, Vl = zn, Oa = oh(async function(t) {
  let r;
  try {
    r = await ql.readdir(t);
  } catch {
    return Wl.mkdirs(t);
  }
  return Promise.all(r.map((n) => Vl.remove(Gl.join(t, n))));
});
function Pa(e) {
  let t;
  try {
    t = ql.readdirSync(e);
  } catch {
    return Wl.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = Gl.join(e, r), Vl.removeSync(r);
  });
}
var ah = {
  emptyDirSync: Pa,
  emptydirSync: Pa,
  emptyDir: Oa,
  emptydir: Oa
};
const sh = Ie.fromCallback, Yl = ie, pt = Re, zl = Je;
function lh(e, t) {
  function r() {
    pt.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  pt.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const o = Yl.dirname(e);
    pt.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? zl.mkdirs(o, (l) => {
          if (l) return t(l);
          r();
        }) : t(a);
      s.isDirectory() ? r() : pt.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function ch(e) {
  let t;
  try {
    t = pt.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = Yl.dirname(e);
  try {
    pt.statSync(r).isDirectory() || pt.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") zl.mkdirsSync(r);
    else throw n;
  }
  pt.writeFileSync(e, "");
}
var uh = {
  createFile: sh(lh),
  createFileSync: ch
};
const fh = Ie.fromCallback, Xl = ie, ht = Re, Kl = Je, dh = Mt.pathExists, { areIdentical: Jl } = lr;
function hh(e, t, r) {
  function n(i, o) {
    ht.link(i, o, (a) => {
      if (a) return r(a);
      r(null);
    });
  }
  ht.lstat(t, (i, o) => {
    ht.lstat(e, (a, s) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), r(a);
      if (o && Jl(s, o)) return r(null);
      const l = Xl.dirname(t);
      dh(l, (d, c) => {
        if (d) return r(d);
        if (c) return n(e, t);
        Kl.mkdirs(l, (f) => {
          if (f) return r(f);
          n(e, t);
        });
      });
    });
  });
}
function ph(e, t) {
  let r;
  try {
    r = ht.lstatSync(t);
  } catch {
  }
  try {
    const o = ht.lstatSync(e);
    if (r && Jl(o, r)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const n = Xl.dirname(t);
  return ht.existsSync(n) || Kl.mkdirsSync(n), ht.linkSync(e, t);
}
var mh = {
  createLink: fh(hh),
  createLinkSync: ph
};
const mt = ie, br = Re, gh = Mt.pathExists;
function yh(e, t, r) {
  if (mt.isAbsolute(e))
    return br.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = mt.dirname(t), i = mt.join(n, e);
    return gh(i, (o, a) => o ? r(o) : a ? r(null, {
      toCwd: i,
      toDst: e
    }) : br.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), r(s)) : r(null, {
      toCwd: e,
      toDst: mt.relative(n, e)
    })));
  }
}
function Eh(e, t) {
  let r;
  if (mt.isAbsolute(e)) {
    if (r = br.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = mt.dirname(t), i = mt.join(n, e);
    if (r = br.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = br.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: mt.relative(n, e)
    };
  }
}
var vh = {
  symlinkPaths: yh,
  symlinkPathsSync: Eh
};
const Ql = Re;
function wh(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  Ql.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function _h(e, t) {
  let r;
  if (t) return t;
  try {
    r = Ql.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var Sh = {
  symlinkType: wh,
  symlinkTypeSync: _h
};
const Ah = Ie.fromCallback, Zl = ie, qe = kt, ec = Je, Th = ec.mkdirs, bh = ec.mkdirsSync, tc = vh, Ch = tc.symlinkPaths, Oh = tc.symlinkPathsSync, rc = Sh, Ph = rc.symlinkType, Ih = rc.symlinkTypeSync, Rh = Mt.pathExists, { areIdentical: nc } = lr;
function Dh(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, qe.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      qe.stat(e),
      qe.stat(t)
    ]).then(([a, s]) => {
      if (nc(a, s)) return n(null);
      Ia(e, t, r, n);
    }) : Ia(e, t, r, n);
  });
}
function Ia(e, t, r, n) {
  Ch(e, t, (i, o) => {
    if (i) return n(i);
    e = o.toDst, Ph(o.toCwd, r, (a, s) => {
      if (a) return n(a);
      const l = Zl.dirname(t);
      Rh(l, (d, c) => {
        if (d) return n(d);
        if (c) return qe.symlink(e, t, s, n);
        Th(l, (f) => {
          if (f) return n(f);
          qe.symlink(e, t, s, n);
        });
      });
    });
  });
}
function Nh(e, t, r) {
  let n;
  try {
    n = qe.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const s = qe.statSync(e), l = qe.statSync(t);
    if (nc(s, l)) return;
  }
  const i = Oh(e, t);
  e = i.toDst, r = Ih(i.toCwd, r);
  const o = Zl.dirname(t);
  return qe.existsSync(o) || bh(o), qe.symlinkSync(e, t, r);
}
var $h = {
  createSymlink: Ah(Dh),
  createSymlinkSync: Nh
};
const { createFile: Ra, createFileSync: Da } = uh, { createLink: Na, createLinkSync: $a } = mh, { createSymlink: Fa, createSymlinkSync: xa } = $h;
var Fh = {
  // file
  createFile: Ra,
  createFileSync: Da,
  ensureFile: Ra,
  ensureFileSync: Da,
  // link
  createLink: Na,
  createLinkSync: $a,
  ensureLink: Na,
  ensureLinkSync: $a,
  // symlink
  createSymlink: Fa,
  createSymlinkSync: xa,
  ensureSymlink: Fa,
  ensureSymlinkSync: xa
};
function xh(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const o = r ? t : "";
  return JSON.stringify(e, n, i).replace(/\n/g, t) + o;
}
function Lh(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var Io = { stringify: xh, stripBom: Lh };
let nr;
try {
  nr = Re;
} catch {
  nr = nt;
}
const Xn = Ie, { stringify: ic, stripBom: oc } = Io;
async function Uh(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || nr, n = "throws" in t ? t.throws : !0;
  let i = await Xn.fromCallback(r.readFile)(e, t);
  i = oc(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (a) {
    if (n)
      throw a.message = `${e}: ${a.message}`, a;
    return null;
  }
  return o;
}
const kh = Xn.fromPromise(Uh);
function Mh(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || nr, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = oc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function Bh(e, t, r = {}) {
  const n = r.fs || nr, i = ic(t, r);
  await Xn.fromCallback(n.writeFile)(e, i, r);
}
const jh = Xn.fromPromise(Bh);
function Hh(e, t, r = {}) {
  const n = r.fs || nr, i = ic(t, r);
  return n.writeFileSync(e, i, r);
}
var qh = {
  readFile: kh,
  readFileSync: Mh,
  writeFile: jh,
  writeFileSync: Hh
};
const gn = qh;
var Gh = {
  // jsonfile exports
  readJson: gn.readFile,
  readJsonSync: gn.readFileSync,
  writeJson: gn.writeFile,
  writeJsonSync: gn.writeFileSync
};
const Wh = Ie.fromCallback, Cr = Re, ac = ie, sc = Je, Vh = Mt.pathExists;
function Yh(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = ac.dirname(e);
  Vh(i, (o, a) => {
    if (o) return n(o);
    if (a) return Cr.writeFile(e, t, r, n);
    sc.mkdirs(i, (s) => {
      if (s) return n(s);
      Cr.writeFile(e, t, r, n);
    });
  });
}
function zh(e, ...t) {
  const r = ac.dirname(e);
  if (Cr.existsSync(r))
    return Cr.writeFileSync(e, ...t);
  sc.mkdirsSync(r), Cr.writeFileSync(e, ...t);
}
var Ro = {
  outputFile: Wh(Yh),
  outputFileSync: zh
};
const { stringify: Xh } = Io, { outputFile: Kh } = Ro;
async function Jh(e, t, r = {}) {
  const n = Xh(t, r);
  await Kh(e, n, r);
}
var Qh = Jh;
const { stringify: Zh } = Io, { outputFileSync: ep } = Ro;
function tp(e, t, r) {
  const n = Zh(t, r);
  ep(e, n, r);
}
var rp = tp;
const np = Ie.fromPromise, Pe = Gh;
Pe.outputJson = np(Qh);
Pe.outputJsonSync = rp;
Pe.outputJSON = Pe.outputJson;
Pe.outputJSONSync = Pe.outputJsonSync;
Pe.writeJSON = Pe.writeJson;
Pe.writeJSONSync = Pe.writeJsonSync;
Pe.readJSON = Pe.readJson;
Pe.readJSONSync = Pe.readJsonSync;
var ip = Pe;
const op = Re, to = ie, ap = Oo.copy, lc = zn.remove, sp = Je.mkdirp, lp = Mt.pathExists, La = lr;
function cp(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  La.checkPaths(e, t, "move", r, (o, a) => {
    if (o) return n(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    La.checkParentPaths(e, s, t, "move", (d) => {
      if (d) return n(d);
      if (up(t)) return Ua(e, t, i, l, n);
      sp(to.dirname(t), (c) => c ? n(c) : Ua(e, t, i, l, n));
    });
  });
}
function up(e) {
  const t = to.dirname(e);
  return to.parse(t).root === t;
}
function Ua(e, t, r, n, i) {
  if (n) return bi(e, t, r, i);
  if (r)
    return lc(t, (o) => o ? i(o) : bi(e, t, r, i));
  lp(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : bi(e, t, r, i));
}
function bi(e, t, r, n) {
  op.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : fp(e, t, r, n) : n());
}
function fp(e, t, r, n) {
  ap(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (o) => o ? n(o) : lc(e, n));
}
var dp = cp;
const cc = Re, ro = ie, hp = Oo.copySync, uc = zn.removeSync, pp = Je.mkdirpSync, ka = lr;
function mp(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = ka.checkPathsSync(e, t, "move", r);
  return ka.checkParentPathsSync(e, i, t, "move"), gp(t) || pp(ro.dirname(t)), yp(e, t, n, o);
}
function gp(e) {
  const t = ro.dirname(e);
  return ro.parse(t).root === t;
}
function yp(e, t, r, n) {
  if (n) return Ci(e, t, r);
  if (r)
    return uc(t), Ci(e, t, r);
  if (cc.existsSync(t)) throw new Error("dest already exists.");
  return Ci(e, t, r);
}
function Ci(e, t, r) {
  try {
    cc.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Ep(e, t, r);
  }
}
function Ep(e, t, r) {
  return hp(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), uc(e);
}
var vp = mp;
const wp = Ie.fromCallback;
var _p = {
  move: wp(dp),
  moveSync: vp
}, St = {
  // Export promiseified graceful-fs:
  ...kt,
  // Export extra methods:
  ...Oo,
  ...ah,
  ...Fh,
  ...ip,
  ...Je,
  ..._p,
  ...Ro,
  ...Mt,
  ...zn
}, it = {}, yt = {}, ge = {}, Et = {};
Object.defineProperty(Et, "__esModule", { value: !0 });
Et.CancellationError = Et.CancellationToken = void 0;
const Sp = _o;
class Ap extends Sp.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new no());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, o) => {
      let a = null;
      if (n = () => {
        try {
          a != null && (a(), a = null);
        } finally {
          o(new no());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, o, (s) => {
        a = s;
      });
    }).then((i) => (r(), i)).catch((i) => {
      throw r(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
Et.CancellationToken = Ap;
class no extends Error {
  constructor() {
    super("cancelled");
  }
}
Et.CancellationError = no;
var cr = {};
Object.defineProperty(cr, "__esModule", { value: !0 });
cr.newError = Tp;
function Tp(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var Oe = {}, io = { exports: {} }, yn = { exports: {} }, Oi, Ma;
function bp() {
  if (Ma) return Oi;
  Ma = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, o = n * 365.25;
  Oi = function(c, f) {
    f = f || {};
    var p = typeof c;
    if (p === "string" && c.length > 0)
      return a(c);
    if (p === "number" && isFinite(c))
      return f.long ? l(c) : s(c);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(c)
    );
  };
  function a(c) {
    if (c = String(c), !(c.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        c
      );
      if (f) {
        var p = parseFloat(f[1]), g = (f[2] || "ms").toLowerCase();
        switch (g) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return p * o;
          case "weeks":
          case "week":
          case "w":
            return p * i;
          case "days":
          case "day":
          case "d":
            return p * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return p * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return p * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return p * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return p;
          default:
            return;
        }
      }
    }
  }
  function s(c) {
    var f = Math.abs(c);
    return f >= n ? Math.round(c / n) + "d" : f >= r ? Math.round(c / r) + "h" : f >= t ? Math.round(c / t) + "m" : f >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var f = Math.abs(c);
    return f >= n ? d(c, f, n, "day") : f >= r ? d(c, f, r, "hour") : f >= t ? d(c, f, t, "minute") : f >= e ? d(c, f, e, "second") : c + " ms";
  }
  function d(c, f, p, g) {
    var _ = f >= p * 1.5;
    return Math.round(c / p) + " " + g + (_ ? "s" : "");
  }
  return Oi;
}
var Pi, Ba;
function fc() {
  if (Ba) return Pi;
  Ba = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = d, n.disable = s, n.enable = o, n.enabled = l, n.humanize = bp(), n.destroy = c, Object.keys(t).forEach((f) => {
      n[f] = t[f];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(f) {
      let p = 0;
      for (let g = 0; g < f.length; g++)
        p = (p << 5) - p + f.charCodeAt(g), p |= 0;
      return n.colors[Math.abs(p) % n.colors.length];
    }
    n.selectColor = r;
    function n(f) {
      let p, g = null, _, E;
      function S(...A) {
        if (!S.enabled)
          return;
        const T = S, $ = Number(/* @__PURE__ */ new Date()), x = $ - (p || $);
        T.diff = x, T.prev = p, T.curr = $, p = $, A[0] = n.coerce(A[0]), typeof A[0] != "string" && A.unshift("%O");
        let te = 0;
        A[0] = A[0].replace(/%([a-zA-Z%])/g, (V, Le) => {
          if (V === "%%")
            return "%";
          te++;
          const y = n.formatters[Le];
          if (typeof y == "function") {
            const q = A[te];
            V = y.call(T, q), A.splice(te, 1), te--;
          }
          return V;
        }), n.formatArgs.call(T, A), (T.log || n.log).apply(T, A);
      }
      return S.namespace = f, S.useColors = n.useColors(), S.color = n.selectColor(f), S.extend = i, S.destroy = n.destroy, Object.defineProperty(S, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => g !== null ? g : (_ !== n.namespaces && (_ = n.namespaces, E = n.enabled(f)), E),
        set: (A) => {
          g = A;
        }
      }), typeof n.init == "function" && n.init(S), S;
    }
    function i(f, p) {
      const g = n(this.namespace + (typeof p > "u" ? ":" : p) + f);
      return g.log = this.log, g;
    }
    function o(f) {
      n.save(f), n.namespaces = f, n.names = [], n.skips = [];
      const p = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const g of p)
        g[0] === "-" ? n.skips.push(g.slice(1)) : n.names.push(g);
    }
    function a(f, p) {
      let g = 0, _ = 0, E = -1, S = 0;
      for (; g < f.length; )
        if (_ < p.length && (p[_] === f[g] || p[_] === "*"))
          p[_] === "*" ? (E = _, S = g, _++) : (g++, _++);
        else if (E !== -1)
          _ = E + 1, S++, g = S;
        else
          return !1;
      for (; _ < p.length && p[_] === "*"; )
        _++;
      return _ === p.length;
    }
    function s() {
      const f = [
        ...n.names,
        ...n.skips.map((p) => "-" + p)
      ].join(",");
      return n.enable(""), f;
    }
    function l(f) {
      for (const p of n.skips)
        if (a(f, p))
          return !1;
      for (const p of n.names)
        if (a(f, p))
          return !0;
      return !1;
    }
    function d(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return Pi = e, Pi;
}
var ja;
function Cp() {
  return ja || (ja = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = o, t.useColors = r, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
      let l = !1;
      return () => {
        l || (l = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function r() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let l;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (l = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(l[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const d = "color: " + this.color;
      l.splice(1, 0, d, "color: inherit");
      let c = 0, f = 0;
      l[0].replace(/%[a-zA-Z%]/g, (p) => {
        p !== "%%" && (c++, p === "%c" && (f = c));
      }), l.splice(f, 0, d);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(l) {
      try {
        l ? t.storage.setItem("debug", l) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let l;
      try {
        l = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !l && typeof process < "u" && "env" in process && (l = process.env.DEBUG), l;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = fc()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (d) {
        return "[UnexpectedJSONParseError]: " + d.message;
      }
    };
  }(yn, yn.exports)), yn.exports;
}
var En = { exports: {} }, Ii, Ha;
function Op() {
  return Ha || (Ha = 1, Ii = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), Ii;
}
var Ri, qa;
function Pp() {
  if (qa) return Ri;
  qa = 1;
  const e = Vr, t = _l, r = Op(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function o(l) {
    return l === 0 ? !1 : {
      level: l,
      hasBasic: !0,
      has256: l >= 2,
      has16m: l >= 3
    };
  }
  function a(l, d) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (l && !d && i === void 0)
      return 0;
    const c = i || 0;
    if (n.TERM === "dumb")
      return c;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in n) || n.CI_NAME === "codeship" ? 1 : c;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const f = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : c;
  }
  function s(l) {
    const d = a(l, l && l.isTTY);
    return o(d);
  }
  return Ri = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, Ri;
}
var Ga;
function Ip() {
  return Ga || (Ga = 1, function(e, t) {
    const r = _l, n = wo;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = d, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const p = Pp();
      p && (p.stderr || p).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((p) => /^debug_/i.test(p)).reduce((p, g) => {
      const _ = g.substring(6).toLowerCase().replace(/_([a-z])/g, (S, A) => A.toUpperCase());
      let E = process.env[g];
      return /^(yes|on|true|enabled)$/i.test(E) ? E = !0 : /^(no|off|false|disabled)$/i.test(E) ? E = !1 : E === "null" ? E = null : E = Number(E), p[_] = E, p;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function o(p) {
      const { namespace: g, useColors: _ } = this;
      if (_) {
        const E = this.color, S = "\x1B[3" + (E < 8 ? E : "8;5;" + E), A = `  ${S};1m${g} \x1B[0m`;
        p[0] = A + p[0].split(`
`).join(`
` + A), p.push(S + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        p[0] = a() + g + " " + p[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function s(...p) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...p) + `
`);
    }
    function l(p) {
      p ? process.env.DEBUG = p : delete process.env.DEBUG;
    }
    function d() {
      return process.env.DEBUG;
    }
    function c(p) {
      p.inspectOpts = {};
      const g = Object.keys(t.inspectOpts);
      for (let _ = 0; _ < g.length; _++)
        p.inspectOpts[g[_]] = t.inspectOpts[g[_]];
    }
    e.exports = fc()(t);
    const { formatters: f } = e.exports;
    f.o = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts).split(`
`).map((g) => g.trim()).join(" ");
    }, f.O = function(p) {
      return this.inspectOpts.colors = this.useColors, n.inspect(p, this.inspectOpts);
    };
  }(En, En.exports)), En.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? io.exports = Cp() : io.exports = Ip();
var Rp = io.exports, zr = {};
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.ProgressCallbackTransform = void 0;
const Dp = ar;
class Np extends Dp.Transform {
  constructor(t, r, n) {
    super(), this.total = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
zr.ProgressCallbackTransform = Np;
Object.defineProperty(Oe, "__esModule", { value: !0 });
Oe.DigestTransform = Oe.HttpExecutor = Oe.HttpError = void 0;
Oe.createHttpError = oo;
Oe.parseJson = Bp;
Oe.configureRequestOptionsFromUrl = hc;
Oe.configureRequestUrl = No;
Oe.safeGetHeader = tr;
Oe.configureRequestOptions = kn;
Oe.safeStringifyJson = Mn;
const $p = Wr, Fp = Rp, xp = nt, Lp = ar, dc = sr, Up = Et, Wa = cr, kp = zr, yr = (0, Fp.default)("electron-builder");
function oo(e, t = null) {
  return new Do(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Mn(e.headers), t);
}
const Mp = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class Do extends Error {
  constructor(t, r = `HTTP error: ${Mp.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Oe.HttpError = Do;
function Bp(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Un {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new Up.CancellationToken(), n) {
    kn(t);
    const i = n == null ? void 0 : JSON.stringify(n), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      yr(i);
      const { headers: a, ...s } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...a
        },
        ...s
      };
    }
    return this.doApiRequest(t, r, (a) => a.end(o));
  }
  doApiRequest(t, r, n, i = 0) {
    return yr.enabled && yr(`Request: ${Mn(t)}`), r.createPromise((o, a, s) => {
      const l = this.createRequest(t, (d) => {
        try {
          this.handleResponse(d, t, r, o, a, i, n);
        } catch (c) {
          a(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, a, t.timeout), this.addRedirectHandlers(l, t, a, i, (d) => {
        this.doApiRequest(d, r, n, i).then(o).catch(a);
      }), n(l, a), s(() => l.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, r, n, i, o) {
  }
  addErrorAndTimeoutHandlers(t, r, n = 60 * 1e3) {
    this.addTimeOutHandler(t, r, n), t.on("error", r), t.on("aborted", () => {
      r(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, r, n, i, o, a, s) {
    var l;
    if (yr.enabled && yr(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Mn(r)}`), t.statusCode === 404) {
      o(oo(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const d = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = d >= 300 && d < 400, f = tr(t, "location");
    if (c && f != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Un.prepareRedirectUrlOptions(f, r), n, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let p = "";
    t.on("error", o), t.on("data", (g) => p += g), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const g = tr(t, "content-type"), _ = g != null && (Array.isArray(g) ? g.find((E) => E.includes("json")) != null : g.includes("json"));
          o(oo(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${_ ? JSON.stringify(JSON.parse(p)) : p}
          `));
        } else
          i(p.length === 0 ? null : p);
      } catch (g) {
        o(g);
      }
    });
  }
  async downloadToBuffer(t, r) {
    return await r.cancellationToken.createPromise((n, i, o) => {
      const a = [], s = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      No(t, s), kn(s), this.doDownload(s, {
        destination: null,
        options: r,
        onCancel: o,
        callback: (l) => {
          l == null ? n(Buffer.concat(a)) : i(l);
        },
        responseHandler: (l, d) => {
          let c = 0;
          l.on("data", (f) => {
            if (c += f.length, c > 524288e3) {
              d(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(f);
          }), l.on("end", () => {
            d(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, r, n) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        r.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", r.callback);
      const a = tr(o, "location");
      if (a != null) {
        n < this.maxRedirects ? this.doDownload(Un.prepareRedirectUrlOptions(a, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? Hp(r, o) : r.responseHandler(o, r.callback);
    });
    this.addErrorAndTimeoutHandlers(i, r.callback, t.timeout), this.addRedirectHandlers(i, t, r.callback, n, (o) => {
      this.doDownload(o, r, n++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, r, n) {
    t.on("socket", (i) => {
      i.setTimeout(n, () => {
        t.abort(), r(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, r) {
    const n = hc(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const o = new dc.URL(t);
      (o.hostname.endsWith(".amazonaws.com") || o.searchParams.has("X-Amz-Credential")) && delete i.authorization;
    }
    return n;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof Do && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Oe.HttpExecutor = Un;
function hc(e, t) {
  const r = kn(t);
  return No(new dc.URL(e), r), r;
}
function No(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class ao extends Lp.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, $p.createHash)(r);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, r, n) {
    this.digester.update(t), n(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (r) {
        t(r);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, Wa.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Wa.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Oe.DigestTransform = ao;
function jp(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function tr(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function Hp(e, t) {
  if (!jp(tr(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const a = tr(t, "content-length");
    a != null && r.push(new kp.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new ao(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new ao(e.options.sha2, "sha256", "hex"));
  const i = (0, xp.createWriteStream)(e.destination);
  r.push(i);
  let o = t;
  for (const a of r)
    a.on("error", (s) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(s);
    }), o = o.pipe(a);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function kn(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Mn(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var Kn = {};
Object.defineProperty(Kn, "__esModule", { value: !0 });
Kn.MemoLazy = void 0;
class qp {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && pc(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
Kn.MemoLazy = qp;
function pc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => pc(e[a], t[a]));
  }
  return e === t;
}
var Jn = {};
Object.defineProperty(Jn, "__esModule", { value: !0 });
Jn.githubUrl = Gp;
Jn.getS3LikeProviderBaseUrl = Wp;
function Gp(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function Wp(e) {
  const t = e.provider;
  if (t === "s3")
    return Vp(e);
  if (t === "spaces")
    return Yp(e);
  throw new Error(`Not supported provider: ${t}`);
}
function Vp(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return mc(t, e.path);
}
function mc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function Yp(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return mc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
$o.retry = gc;
const zp = Et;
async function gc(e, t, r, n = 0, i = 0, o) {
  var a;
  const s = new zp.CancellationToken();
  try {
    return await e();
  } catch (l) {
    if ((!((a = o == null ? void 0 : o(l)) !== null && a !== void 0) || a) && t > 0 && !s.cancelled)
      return await new Promise((d) => setTimeout(d, r + n * i)), await gc(e, t - 1, r, n, i + 1, o);
    throw l;
  }
}
var Fo = {};
Object.defineProperty(Fo, "__esModule", { value: !0 });
Fo.parseDn = Xp;
function Xp(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let a = 0; a <= e.length; a++) {
    if (a === e.length) {
      r !== null && o.set(r, n);
      break;
    }
    const s = e[a];
    if (t) {
      if (s === '"') {
        t = !1;
        continue;
      }
    } else {
      if (s === '"') {
        t = !0;
        continue;
      }
      if (s === "\\") {
        a++;
        const l = parseInt(e.slice(a, a + 2), 16);
        Number.isNaN(l) ? n += e[a] : (a++, n += String.fromCharCode(l));
        continue;
      }
      if (r === null && s === "=") {
        r = n, n = "";
        continue;
      }
      if (s === "," || s === ";" || s === "+") {
        r !== null && o.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (s === " " && !t) {
      if (n.length === 0)
        continue;
      if (a > i) {
        let l = a;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        a = i - 1;
        continue;
      }
    }
    n += s;
  }
  return o;
}
var ir = {};
Object.defineProperty(ir, "__esModule", { value: !0 });
ir.nil = ir.UUID = void 0;
const yc = Wr, Ec = cr, Kp = "options.name must be either a string or a Buffer", Va = (0, yc.randomBytes)(16);
Va[0] = Va[0] | 1;
const $n = {}, W = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  $n[t] = e, W[e] = t;
}
class Ut {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = Ut.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return Jp(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = Qp(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: ($n[t[14] + t[15]] & 240) >> 4,
        variant: Ya(($n[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < r + 16)
        return !1;
      let n = 0;
      for (; n < 16 && t[r + n] === 0; n++)
        ;
      return n === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[r + 6] & 240) >> 4,
        variant: Ya((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, Ec.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = $n[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
ir.UUID = Ut;
Ut.OID = Ut.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Ya(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var Or;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Or || (Or = {}));
function Jp(e, t, r, n, i = Or.ASCII) {
  const o = (0, yc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Ec.newError)(Kp, "ERR_INVALID_UUID_NAME");
  o.update(n), o.update(e);
  const s = o.digest();
  let l;
  switch (i) {
    case Or.BINARY:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = s;
      break;
    case Or.OBJECT:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = new Ut(s);
      break;
    default:
      l = W[s[0]] + W[s[1]] + W[s[2]] + W[s[3]] + "-" + W[s[4]] + W[s[5]] + "-" + W[s[6] & 15 | r] + W[s[7]] + "-" + W[s[8] & 63 | 128] + W[s[9]] + "-" + W[s[10]] + W[s[11]] + W[s[12]] + W[s[13]] + W[s[14]] + W[s[15]];
      break;
  }
  return l;
}
function Qp(e) {
  return W[e[0]] + W[e[1]] + W[e[2]] + W[e[3]] + "-" + W[e[4]] + W[e[5]] + "-" + W[e[6]] + W[e[7]] + "-" + W[e[8]] + W[e[9]] + "-" + W[e[10]] + W[e[11]] + W[e[12]] + W[e[13]] + W[e[14]] + W[e[15]];
}
ir.nil = new Ut("00000000-0000-0000-0000-000000000000");
var Xr = {}, vc = {};
(function(e) {
  (function(t) {
    t.parser = function(h, u) {
      return new n(h, u);
    }, t.SAXParser = n, t.SAXStream = c, t.createStream = d, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function n(h, u) {
      if (!(this instanceof n))
        return new n(h, u);
      var b = this;
      o(b), b.q = b.c = "", b.bufferCheckPosition = t.MAX_BUFFER_LENGTH, b.opt = u || {}, b.opt.lowercase = b.opt.lowercase || b.opt.lowercasetags, b.looseCase = b.opt.lowercase ? "toLowerCase" : "toUpperCase", b.tags = [], b.closed = b.closedRoot = b.sawRoot = !1, b.tag = b.error = null, b.strict = !!h, b.noscript = !!(h || b.opt.noscript), b.state = y.BEGIN, b.strictEntities = b.opt.strictEntities, b.ENTITIES = b.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), b.attribList = [], b.opt.xmlns && (b.ns = Object.create(E)), b.opt.unquotedAttributeValues === void 0 && (b.opt.unquotedAttributeValues = !h), b.trackPosition = b.opt.position !== !1, b.trackPosition && (b.position = b.line = b.column = 0), B(b, "onready");
    }
    Object.create || (Object.create = function(h) {
      function u() {
      }
      u.prototype = h;
      var b = new u();
      return b;
    }), Object.keys || (Object.keys = function(h) {
      var u = [];
      for (var b in h) h.hasOwnProperty(b) && u.push(b);
      return u;
    });
    function i(h) {
      for (var u = Math.max(t.MAX_BUFFER_LENGTH, 10), b = 0, w = 0, Y = r.length; w < Y; w++) {
        var Q = h[r[w]].length;
        if (Q > u)
          switch (r[w]) {
            case "textNode":
              z(h);
              break;
            case "cdata":
              M(h, "oncdata", h.cdata), h.cdata = "";
              break;
            case "script":
              M(h, "onscript", h.script), h.script = "";
              break;
            default:
              O(h, "Max buffer length exceeded: " + r[w]);
          }
        b = Math.max(b, Q);
      }
      var oe = t.MAX_BUFFER_LENGTH - b;
      h.bufferCheckPosition = oe + h.position;
    }
    function o(h) {
      for (var u = 0, b = r.length; u < b; u++)
        h[r[u]] = "";
    }
    function a(h) {
      z(h), h.cdata !== "" && (M(h, "oncdata", h.cdata), h.cdata = ""), h.script !== "" && (M(h, "onscript", h.script), h.script = "");
    }
    n.prototype = {
      end: function() {
        D(this);
      },
      write: Ye,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        a(this);
      }
    };
    var s;
    try {
      s = require("stream").Stream;
    } catch {
      s = function() {
      };
    }
    s || (s = function() {
    });
    var l = t.EVENTS.filter(function(h) {
      return h !== "error" && h !== "end";
    });
    function d(h, u) {
      return new c(h, u);
    }
    function c(h, u) {
      if (!(this instanceof c))
        return new c(h, u);
      s.apply(this), this._parser = new n(h, u), this.writable = !0, this.readable = !0;
      var b = this;
      this._parser.onend = function() {
        b.emit("end");
      }, this._parser.onerror = function(w) {
        b.emit("error", w), b._parser.error = null;
      }, this._decoder = null, l.forEach(function(w) {
        Object.defineProperty(b, "on" + w, {
          get: function() {
            return b._parser["on" + w];
          },
          set: function(Y) {
            if (!Y)
              return b.removeAllListeners(w), b._parser["on" + w] = Y, Y;
            b.on(w, Y);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    c.prototype = Object.create(s.prototype, {
      constructor: {
        value: c
      }
    }), c.prototype.write = function(h) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(h)) {
        if (!this._decoder) {
          var u = Hf.StringDecoder;
          this._decoder = new u("utf8");
        }
        h = this._decoder.write(h);
      }
      return this._parser.write(h.toString()), this.emit("data", h), !0;
    }, c.prototype.end = function(h) {
      return h && h.length && this.write(h), this._parser.end(), !0;
    }, c.prototype.on = function(h, u) {
      var b = this;
      return !b._parser["on" + h] && l.indexOf(h) !== -1 && (b._parser["on" + h] = function() {
        var w = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        w.splice(0, 0, h), b.emit.apply(b, w);
      }), s.prototype.on.call(b, h, u);
    };
    var f = "[CDATA[", p = "DOCTYPE", g = "http://www.w3.org/XML/1998/namespace", _ = "http://www.w3.org/2000/xmlns/", E = { xml: g, xmlns: _ }, S = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, T = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, $ = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function x(h) {
      return h === " " || h === `
` || h === "\r" || h === "	";
    }
    function te(h) {
      return h === '"' || h === "'";
    }
    function se(h) {
      return h === ">" || x(h);
    }
    function V(h, u) {
      return h.test(u);
    }
    function Le(h, u) {
      return !V(h, u);
    }
    var y = 0;
    t.STATE = {
      BEGIN: y++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: y++,
      // leading whitespace
      TEXT: y++,
      // general stuff
      TEXT_ENTITY: y++,
      // &amp and such.
      OPEN_WAKA: y++,
      // <
      SGML_DECL: y++,
      // <!BLARG
      SGML_DECL_QUOTED: y++,
      // <!BLARG foo "bar
      DOCTYPE: y++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: y++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: y++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: y++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: y++,
      // <!-
      COMMENT: y++,
      // <!--
      COMMENT_ENDING: y++,
      // <!-- blah -
      COMMENT_ENDED: y++,
      // <!-- blah --
      CDATA: y++,
      // <![CDATA[ something
      CDATA_ENDING: y++,
      // ]
      CDATA_ENDING_2: y++,
      // ]]
      PROC_INST: y++,
      // <?hi
      PROC_INST_BODY: y++,
      // <?hi there
      PROC_INST_ENDING: y++,
      // <?hi "there" ?
      OPEN_TAG: y++,
      // <strong
      OPEN_TAG_SLASH: y++,
      // <strong /
      ATTRIB: y++,
      // <a
      ATTRIB_NAME: y++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: y++,
      // <a foo _
      ATTRIB_VALUE: y++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: y++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: y++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: y++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: y++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: y++,
      // <foo bar=&quot
      CLOSE_TAG: y++,
      // </a
      CLOSE_TAG_SAW_WHITE: y++,
      // </a   >
      SCRIPT: y++,
      // <script> ...
      SCRIPT_ENDING: y++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(h) {
      var u = t.ENTITIES[h], b = typeof u == "number" ? String.fromCharCode(u) : u;
      t.ENTITIES[h] = b;
    });
    for (var q in t.STATE)
      t.STATE[t.STATE[q]] = q;
    y = t.STATE;
    function B(h, u, b) {
      h[u] && h[u](b);
    }
    function M(h, u, b) {
      h.textNode && z(h), B(h, u, b);
    }
    function z(h) {
      h.textNode = I(h.opt, h.textNode), h.textNode && B(h, "ontext", h.textNode), h.textNode = "";
    }
    function I(h, u) {
      return h.trim && (u = u.trim()), h.normalize && (u = u.replace(/\s+/g, " ")), u;
    }
    function O(h, u) {
      return z(h), h.trackPosition && (u += `
Line: ` + h.line + `
Column: ` + h.column + `
Char: ` + h.c), u = new Error(u), h.error = u, B(h, "onerror", u), h;
    }
    function D(h) {
      return h.sawRoot && !h.closedRoot && C(h, "Unclosed root tag"), h.state !== y.BEGIN && h.state !== y.BEGIN_WHITESPACE && h.state !== y.TEXT && O(h, "Unexpected end"), z(h), h.c = "", h.closed = !0, B(h, "onend"), n.call(h, h.strict, h.opt), h;
    }
    function C(h, u) {
      if (typeof h != "object" || !(h instanceof n))
        throw new Error("bad call to strictFail");
      h.strict && O(h, u);
    }
    function N(h) {
      h.strict || (h.tagName = h.tagName[h.looseCase]());
      var u = h.tags[h.tags.length - 1] || h, b = h.tag = { name: h.tagName, attributes: {} };
      h.opt.xmlns && (b.ns = u.ns), h.attribList.length = 0, M(h, "onopentagstart", b);
    }
    function R(h, u) {
      var b = h.indexOf(":"), w = b < 0 ? ["", h] : h.split(":"), Y = w[0], Q = w[1];
      return u && h === "xmlns" && (Y = "xmlns", Q = ""), { prefix: Y, local: Q };
    }
    function k(h) {
      if (h.strict || (h.attribName = h.attribName[h.looseCase]()), h.attribList.indexOf(h.attribName) !== -1 || h.tag.attributes.hasOwnProperty(h.attribName)) {
        h.attribName = h.attribValue = "";
        return;
      }
      if (h.opt.xmlns) {
        var u = R(h.attribName, !0), b = u.prefix, w = u.local;
        if (b === "xmlns")
          if (w === "xml" && h.attribValue !== g)
            C(
              h,
              "xml: prefix must be bound to " + g + `
Actual: ` + h.attribValue
            );
          else if (w === "xmlns" && h.attribValue !== _)
            C(
              h,
              "xmlns: prefix must be bound to " + _ + `
Actual: ` + h.attribValue
            );
          else {
            var Y = h.tag, Q = h.tags[h.tags.length - 1] || h;
            Y.ns === Q.ns && (Y.ns = Object.create(Q.ns)), Y.ns[w] = h.attribValue;
          }
        h.attribList.push([h.attribName, h.attribValue]);
      } else
        h.tag.attributes[h.attribName] = h.attribValue, M(h, "onattribute", {
          name: h.attribName,
          value: h.attribValue
        });
      h.attribName = h.attribValue = "";
    }
    function G(h, u) {
      if (h.opt.xmlns) {
        var b = h.tag, w = R(h.tagName);
        b.prefix = w.prefix, b.local = w.local, b.uri = b.ns[w.prefix] || "", b.prefix && !b.uri && (C(
          h,
          "Unbound namespace prefix: " + JSON.stringify(h.tagName)
        ), b.uri = w.prefix);
        var Y = h.tags[h.tags.length - 1] || h;
        b.ns && Y.ns !== b.ns && Object.keys(b.ns).forEach(function(on) {
          M(h, "onopennamespace", {
            prefix: on,
            uri: b.ns[on]
          });
        });
        for (var Q = 0, oe = h.attribList.length; Q < oe; Q++) {
          var ye = h.attribList[Q], _e = ye[0], ot = ye[1], ue = R(_e, !0), je = ue.prefix, mi = ue.local, nn = je === "" ? "" : b.ns[je] || "", dr = {
            name: _e,
            value: ot,
            prefix: je,
            local: mi,
            uri: nn
          };
          je && je !== "xmlns" && !nn && (C(
            h,
            "Unbound namespace prefix: " + JSON.stringify(je)
          ), dr.uri = je), h.tag.attributes[_e] = dr, M(h, "onattribute", dr);
        }
        h.attribList.length = 0;
      }
      h.tag.isSelfClosing = !!u, h.sawRoot = !0, h.tags.push(h.tag), M(h, "onopentag", h.tag), u || (!h.noscript && h.tagName.toLowerCase() === "script" ? h.state = y.SCRIPT : h.state = y.TEXT, h.tag = null, h.tagName = ""), h.attribName = h.attribValue = "", h.attribList.length = 0;
    }
    function j(h) {
      if (!h.tagName) {
        C(h, "Weird empty close tag."), h.textNode += "</>", h.state = y.TEXT;
        return;
      }
      if (h.script) {
        if (h.tagName !== "script") {
          h.script += "</" + h.tagName + ">", h.tagName = "", h.state = y.SCRIPT;
          return;
        }
        M(h, "onscript", h.script), h.script = "";
      }
      var u = h.tags.length, b = h.tagName;
      h.strict || (b = b[h.looseCase]());
      for (var w = b; u--; ) {
        var Y = h.tags[u];
        if (Y.name !== w)
          C(h, "Unexpected close tag");
        else
          break;
      }
      if (u < 0) {
        C(h, "Unmatched closing tag: " + h.tagName), h.textNode += "</" + h.tagName + ">", h.state = y.TEXT;
        return;
      }
      h.tagName = b;
      for (var Q = h.tags.length; Q-- > u; ) {
        var oe = h.tag = h.tags.pop();
        h.tagName = h.tag.name, M(h, "onclosetag", h.tagName);
        var ye = {};
        for (var _e in oe.ns)
          ye[_e] = oe.ns[_e];
        var ot = h.tags[h.tags.length - 1] || h;
        h.opt.xmlns && oe.ns !== ot.ns && Object.keys(oe.ns).forEach(function(ue) {
          var je = oe.ns[ue];
          M(h, "onclosenamespace", { prefix: ue, uri: je });
        });
      }
      u === 0 && (h.closedRoot = !0), h.tagName = h.attribValue = h.attribName = "", h.attribList.length = 0, h.state = y.TEXT;
    }
    function X(h) {
      var u = h.entity, b = u.toLowerCase(), w, Y = "";
      return h.ENTITIES[u] ? h.ENTITIES[u] : h.ENTITIES[b] ? h.ENTITIES[b] : (u = b, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), w = parseInt(u, 16), Y = w.toString(16)) : (u = u.slice(1), w = parseInt(u, 10), Y = w.toString(10))), u = u.replace(/^0+/, ""), isNaN(w) || Y.toLowerCase() !== u || w < 0 || w > 1114111 ? (C(h, "Invalid character entity"), "&" + h.entity + ";") : String.fromCodePoint(w));
    }
    function he(h, u) {
      u === "<" ? (h.state = y.OPEN_WAKA, h.startTagPosition = h.position) : x(u) || (C(h, "Non-whitespace before first tag."), h.textNode = u, h.state = y.TEXT);
    }
    function U(h, u) {
      var b = "";
      return u < h.length && (b = h.charAt(u)), b;
    }
    function Ye(h) {
      var u = this;
      if (this.error)
        throw this.error;
      if (u.closed)
        return O(
          u,
          "Cannot write after close. Assign an onready handler."
        );
      if (h === null)
        return D(u);
      typeof h == "object" && (h = h.toString());
      for (var b = 0, w = ""; w = U(h, b++), u.c = w, !!w; )
        switch (u.trackPosition && (u.position++, w === `
` ? (u.line++, u.column = 0) : u.column++), u.state) {
          case y.BEGIN:
            if (u.state = y.BEGIN_WHITESPACE, w === "\uFEFF")
              continue;
            he(u, w);
            continue;
          case y.BEGIN_WHITESPACE:
            he(u, w);
            continue;
          case y.TEXT:
            if (u.sawRoot && !u.closedRoot) {
              for (var Q = b - 1; w && w !== "<" && w !== "&"; )
                w = U(h, b++), w && u.trackPosition && (u.position++, w === `
` ? (u.line++, u.column = 0) : u.column++);
              u.textNode += h.substring(Q, b - 1);
            }
            w === "<" && !(u.sawRoot && u.closedRoot && !u.strict) ? (u.state = y.OPEN_WAKA, u.startTagPosition = u.position) : (!x(w) && (!u.sawRoot || u.closedRoot) && C(u, "Text data outside of root node."), w === "&" ? u.state = y.TEXT_ENTITY : u.textNode += w);
            continue;
          case y.SCRIPT:
            w === "<" ? u.state = y.SCRIPT_ENDING : u.script += w;
            continue;
          case y.SCRIPT_ENDING:
            w === "/" ? u.state = y.CLOSE_TAG : (u.script += "<" + w, u.state = y.SCRIPT);
            continue;
          case y.OPEN_WAKA:
            if (w === "!")
              u.state = y.SGML_DECL, u.sgmlDecl = "";
            else if (!x(w)) if (V(S, w))
              u.state = y.OPEN_TAG, u.tagName = w;
            else if (w === "/")
              u.state = y.CLOSE_TAG, u.tagName = "";
            else if (w === "?")
              u.state = y.PROC_INST, u.procInstName = u.procInstBody = "";
            else {
              if (C(u, "Unencoded <"), u.startTagPosition + 1 < u.position) {
                var Y = u.position - u.startTagPosition;
                w = new Array(Y).join(" ") + w;
              }
              u.textNode += "<" + w, u.state = y.TEXT;
            }
            continue;
          case y.SGML_DECL:
            if (u.sgmlDecl + w === "--") {
              u.state = y.COMMENT, u.comment = "", u.sgmlDecl = "";
              continue;
            }
            u.doctype && u.doctype !== !0 && u.sgmlDecl ? (u.state = y.DOCTYPE_DTD, u.doctype += "<!" + u.sgmlDecl + w, u.sgmlDecl = "") : (u.sgmlDecl + w).toUpperCase() === f ? (M(u, "onopencdata"), u.state = y.CDATA, u.sgmlDecl = "", u.cdata = "") : (u.sgmlDecl + w).toUpperCase() === p ? (u.state = y.DOCTYPE, (u.doctype || u.sawRoot) && C(
              u,
              "Inappropriately located doctype declaration"
            ), u.doctype = "", u.sgmlDecl = "") : w === ">" ? (M(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = y.TEXT) : (te(w) && (u.state = y.SGML_DECL_QUOTED), u.sgmlDecl += w);
            continue;
          case y.SGML_DECL_QUOTED:
            w === u.q && (u.state = y.SGML_DECL, u.q = ""), u.sgmlDecl += w;
            continue;
          case y.DOCTYPE:
            w === ">" ? (u.state = y.TEXT, M(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += w, w === "[" ? u.state = y.DOCTYPE_DTD : te(w) && (u.state = y.DOCTYPE_QUOTED, u.q = w));
            continue;
          case y.DOCTYPE_QUOTED:
            u.doctype += w, w === u.q && (u.q = "", u.state = y.DOCTYPE);
            continue;
          case y.DOCTYPE_DTD:
            w === "]" ? (u.doctype += w, u.state = y.DOCTYPE) : w === "<" ? (u.state = y.OPEN_WAKA, u.startTagPosition = u.position) : te(w) ? (u.doctype += w, u.state = y.DOCTYPE_DTD_QUOTED, u.q = w) : u.doctype += w;
            continue;
          case y.DOCTYPE_DTD_QUOTED:
            u.doctype += w, w === u.q && (u.state = y.DOCTYPE_DTD, u.q = "");
            continue;
          case y.COMMENT:
            w === "-" ? u.state = y.COMMENT_ENDING : u.comment += w;
            continue;
          case y.COMMENT_ENDING:
            w === "-" ? (u.state = y.COMMENT_ENDED, u.comment = I(u.opt, u.comment), u.comment && M(u, "oncomment", u.comment), u.comment = "") : (u.comment += "-" + w, u.state = y.COMMENT);
            continue;
          case y.COMMENT_ENDED:
            w !== ">" ? (C(u, "Malformed comment"), u.comment += "--" + w, u.state = y.COMMENT) : u.doctype && u.doctype !== !0 ? u.state = y.DOCTYPE_DTD : u.state = y.TEXT;
            continue;
          case y.CDATA:
            for (var Q = b - 1; w && w !== "]"; )
              w = U(h, b++), w && u.trackPosition && (u.position++, w === `
` ? (u.line++, u.column = 0) : u.column++);
            u.cdata += h.substring(Q, b - 1), w === "]" && (u.state = y.CDATA_ENDING);
            continue;
          case y.CDATA_ENDING:
            w === "]" ? u.state = y.CDATA_ENDING_2 : (u.cdata += "]" + w, u.state = y.CDATA);
            continue;
          case y.CDATA_ENDING_2:
            w === ">" ? (u.cdata && M(u, "oncdata", u.cdata), M(u, "onclosecdata"), u.cdata = "", u.state = y.TEXT) : w === "]" ? u.cdata += "]" : (u.cdata += "]]" + w, u.state = y.CDATA);
            continue;
          case y.PROC_INST:
            w === "?" ? u.state = y.PROC_INST_ENDING : x(w) ? u.state = y.PROC_INST_BODY : u.procInstName += w;
            continue;
          case y.PROC_INST_BODY:
            if (!u.procInstBody && x(w))
              continue;
            w === "?" ? u.state = y.PROC_INST_ENDING : u.procInstBody += w;
            continue;
          case y.PROC_INST_ENDING:
            w === ">" ? (M(u, "onprocessinginstruction", {
              name: u.procInstName,
              body: u.procInstBody
            }), u.procInstName = u.procInstBody = "", u.state = y.TEXT) : (u.procInstBody += "?" + w, u.state = y.PROC_INST_BODY);
            continue;
          case y.OPEN_TAG:
            V(A, w) ? u.tagName += w : (N(u), w === ">" ? G(u) : w === "/" ? u.state = y.OPEN_TAG_SLASH : (x(w) || C(u, "Invalid character in tag name"), u.state = y.ATTRIB));
            continue;
          case y.OPEN_TAG_SLASH:
            w === ">" ? (G(u, !0), j(u)) : (C(
              u,
              "Forward-slash in opening tag not followed by >"
            ), u.state = y.ATTRIB);
            continue;
          case y.ATTRIB:
            if (x(w))
              continue;
            w === ">" ? G(u) : w === "/" ? u.state = y.OPEN_TAG_SLASH : V(S, w) ? (u.attribName = w, u.attribValue = "", u.state = y.ATTRIB_NAME) : C(u, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME:
            w === "=" ? u.state = y.ATTRIB_VALUE : w === ">" ? (C(u, "Attribute without value"), u.attribValue = u.attribName, k(u), G(u)) : x(w) ? u.state = y.ATTRIB_NAME_SAW_WHITE : V(A, w) ? u.attribName += w : C(u, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME_SAW_WHITE:
            if (w === "=")
              u.state = y.ATTRIB_VALUE;
            else {
              if (x(w))
                continue;
              C(u, "Attribute without value"), u.tag.attributes[u.attribName] = "", u.attribValue = "", M(u, "onattribute", {
                name: u.attribName,
                value: ""
              }), u.attribName = "", w === ">" ? G(u) : V(S, w) ? (u.attribName = w, u.state = y.ATTRIB_NAME) : (C(u, "Invalid attribute name"), u.state = y.ATTRIB);
            }
            continue;
          case y.ATTRIB_VALUE:
            if (x(w))
              continue;
            te(w) ? (u.q = w, u.state = y.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || O(u, "Unquoted attribute value"), u.state = y.ATTRIB_VALUE_UNQUOTED, u.attribValue = w);
            continue;
          case y.ATTRIB_VALUE_QUOTED:
            if (w !== u.q) {
              w === "&" ? u.state = y.ATTRIB_VALUE_ENTITY_Q : u.attribValue += w;
              continue;
            }
            k(u), u.q = "", u.state = y.ATTRIB_VALUE_CLOSED;
            continue;
          case y.ATTRIB_VALUE_CLOSED:
            x(w) ? u.state = y.ATTRIB : w === ">" ? G(u) : w === "/" ? u.state = y.OPEN_TAG_SLASH : V(S, w) ? (C(u, "No whitespace between attributes"), u.attribName = w, u.attribValue = "", u.state = y.ATTRIB_NAME) : C(u, "Invalid attribute name");
            continue;
          case y.ATTRIB_VALUE_UNQUOTED:
            if (!se(w)) {
              w === "&" ? u.state = y.ATTRIB_VALUE_ENTITY_U : u.attribValue += w;
              continue;
            }
            k(u), w === ">" ? G(u) : u.state = y.ATTRIB;
            continue;
          case y.CLOSE_TAG:
            if (u.tagName)
              w === ">" ? j(u) : V(A, w) ? u.tagName += w : u.script ? (u.script += "</" + u.tagName, u.tagName = "", u.state = y.SCRIPT) : (x(w) || C(u, "Invalid tagname in closing tag"), u.state = y.CLOSE_TAG_SAW_WHITE);
            else {
              if (x(w))
                continue;
              Le(S, w) ? u.script ? (u.script += "</" + w, u.state = y.SCRIPT) : C(u, "Invalid tagname in closing tag.") : u.tagName = w;
            }
            continue;
          case y.CLOSE_TAG_SAW_WHITE:
            if (x(w))
              continue;
            w === ">" ? j(u) : C(u, "Invalid characters in closing tag");
            continue;
          case y.TEXT_ENTITY:
          case y.ATTRIB_VALUE_ENTITY_Q:
          case y.ATTRIB_VALUE_ENTITY_U:
            var oe, ye;
            switch (u.state) {
              case y.TEXT_ENTITY:
                oe = y.TEXT, ye = "textNode";
                break;
              case y.ATTRIB_VALUE_ENTITY_Q:
                oe = y.ATTRIB_VALUE_QUOTED, ye = "attribValue";
                break;
              case y.ATTRIB_VALUE_ENTITY_U:
                oe = y.ATTRIB_VALUE_UNQUOTED, ye = "attribValue";
                break;
            }
            if (w === ";") {
              var _e = X(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(_e) ? (u.entity = "", u.state = oe, u.write(_e)) : (u[ye] += _e, u.entity = "", u.state = oe);
            } else V(u.entity.length ? $ : T, w) ? u.entity += w : (C(u, "Invalid character in entity name"), u[ye] += "&" + u.entity + w, u.entity = "", u.state = oe);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var h = String.fromCharCode, u = Math.floor, b = function() {
        var w = 16384, Y = [], Q, oe, ye = -1, _e = arguments.length;
        if (!_e)
          return "";
        for (var ot = ""; ++ye < _e; ) {
          var ue = Number(arguments[ye]);
          if (!isFinite(ue) || // `NaN`, `+Infinity`, or `-Infinity`
          ue < 0 || // not a valid Unicode code point
          ue > 1114111 || // not a valid Unicode code point
          u(ue) !== ue)
            throw RangeError("Invalid code point: " + ue);
          ue <= 65535 ? Y.push(ue) : (ue -= 65536, Q = (ue >> 10) + 55296, oe = ue % 1024 + 56320, Y.push(Q, oe)), (ye + 1 === _e || Y.length > w) && (ot += h.apply(null, Y), Y.length = 0);
        }
        return ot;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: b,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = b;
    }();
  })(e);
})(vc);
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.XElement = void 0;
Xr.parseXml = rm;
const Zp = vc, vn = cr;
class wc {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, vn.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!tm(t))
      throw (0, vn.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, vn.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, vn.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (za(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => za(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
Xr.XElement = wc;
const em = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function tm(e) {
  return em.test(e);
}
function za(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function rm(e) {
  let t = null;
  const r = Zp.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const o = new wc(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const a = n[n.length - 1];
      a.elements == null && (a.elements = []), a.elements.push(o);
    }
    n.push(o);
  }, r.onclosetag = () => {
    n.pop();
  }, r.ontext = (i) => {
    n.length > 0 && (n[n.length - 1].value = i);
  }, r.oncdata = (i) => {
    const o = n[n.length - 1];
    o.value = i, o.isCData = !0;
  }, r.onerror = (i) => {
    throw i;
  }, r.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = Et;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = cr;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = Oe;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } });
  var i = Kn;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = zr;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var a = Jn;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } });
  var s = $o;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = Fo;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var d = ir;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return d.UUID;
  } });
  var c = Xr;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(p) {
    return p == null ? [] : Array.isArray(p) ? p : [p];
  }
})(ge);
var we = {}, xo = {}, Ge = {};
function _c(e) {
  return typeof e > "u" || e === null;
}
function nm(e) {
  return typeof e == "object" && e !== null;
}
function im(e) {
  return Array.isArray(e) ? e : _c(e) ? [] : [e];
}
function om(e, t) {
  var r, n, i, o;
  if (t)
    for (o = Object.keys(t), r = 0, n = o.length; r < n; r += 1)
      i = o[r], e[i] = t[i];
  return e;
}
function am(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function sm(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
Ge.isNothing = _c;
Ge.isObject = nm;
Ge.toArray = im;
Ge.repeat = am;
Ge.isNegativeZero = sm;
Ge.extend = om;
function Sc(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function Fr(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Sc(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Fr.prototype = Object.create(Error.prototype);
Fr.prototype.constructor = Fr;
Fr.prototype.toString = function(t) {
  return this.name + ": " + Sc(this, t);
};
var Kr = Fr, Ar = Ge;
function Di(e, t, r, n, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return n - t > s && (o = " ... ", t = n - s + o.length), r - n > s && (a = " ...", r = n + s - a.length), {
    str: o + e.slice(t, r).replace(/\t/g, "→") + a,
    pos: n - t + o.length
    // relative position
  };
}
function Ni(e, t) {
  return Ar.repeat(" ", t - e.length) + e;
}
function lm(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], o, a = -1; o = r.exec(e.buffer); )
    i.push(o.index), n.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = n.length - 2);
  a < 0 && (a = n.length - 1);
  var s = "", l, d, c = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    d = Di(
      e.buffer,
      n[a - l],
      i[a - l],
      e.position - (n[a] - n[a - l]),
      f
    ), s = Ar.repeat(" ", t.indent) + Ni((e.line - l + 1).toString(), c) + " | " + d.str + `
` + s;
  for (d = Di(e.buffer, n[a], i[a], e.position, f), s += Ar.repeat(" ", t.indent) + Ni((e.line + 1).toString(), c) + " | " + d.str + `
`, s += Ar.repeat("-", t.indent + c + 3 + d.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    d = Di(
      e.buffer,
      n[a + l],
      i[a + l],
      e.position - (n[a] - n[a + l]),
      f
    ), s += Ar.repeat(" ", t.indent) + Ni((e.line + l + 1).toString(), c) + " | " + d.str + `
`;
  return s.replace(/\n$/, "");
}
var cm = lm, Xa = Kr, um = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], fm = [
  "scalar",
  "sequence",
  "mapping"
];
function dm(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function hm(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (um.indexOf(r) === -1)
      throw new Xa('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = dm(t.styleAliases || null), fm.indexOf(this.kind) === -1)
    throw new Xa('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var De = hm, Er = Kr, $i = De;
function Ka(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(o, a) {
      o.tag === n.tag && o.kind === n.kind && o.multi === n.multi && (i = a);
    }), r[i] = n;
  }), r;
}
function pm() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, r;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(n);
  return e;
}
function so(e) {
  return this.extend(e);
}
so.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof $i)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new Er("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(o) {
    if (!(o instanceof $i))
      throw new Er("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new Er("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new Er("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(o) {
    if (!(o instanceof $i))
      throw new Er("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(so.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = Ka(i, "implicit"), i.compiledExplicit = Ka(i, "explicit"), i.compiledTypeMap = pm(i.compiledImplicit, i.compiledExplicit), i;
};
var Ac = so, mm = De, Tc = new mm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), gm = De, bc = new gm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), ym = De, Cc = new ym("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), Em = Ac, Oc = new Em({
  explicit: [
    Tc,
    bc,
    Cc
  ]
}), vm = De;
function wm(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function _m() {
  return null;
}
function Sm(e) {
  return e === null;
}
var Pc = new vm("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: wm,
  construct: _m,
  predicate: Sm,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), Am = De;
function Tm(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function bm(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function Cm(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Ic = new Am("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Tm,
  construct: bm,
  predicate: Cm,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), Om = Ge, Pm = De;
function Im(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function Rm(e) {
  return 48 <= e && e <= 55;
}
function Dm(e) {
  return 48 <= e && e <= 57;
}
function Nm(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, n = !1, i;
  if (!t) return !1;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!Im(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!Rm(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!Dm(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function $m(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function Fm(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !Om.isNegativeZero(e);
}
var Rc = new Pm("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: Nm,
  construct: $m,
  predicate: Fm,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), Dc = Ge, xm = De, Lm = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function Um(e) {
  return !(e === null || !Lm.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function km(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var Mm = /^[-+]?[0-9]+e/;
function Bm(e, t) {
  var r;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (Dc.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), Mm.test(r) ? r.replace("e", ".e") : r;
}
function jm(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Dc.isNegativeZero(e));
}
var Nc = new xm("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: Um,
  construct: km,
  predicate: jm,
  represent: Bm,
  defaultStyle: "lowercase"
}), $c = Oc.extend({
  implicit: [
    Pc,
    Ic,
    Rc,
    Nc
  ]
}), Fc = $c, Hm = De, xc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Lc = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function qm(e) {
  return e === null ? !1 : xc.exec(e) !== null || Lc.exec(e) !== null;
}
function Gm(e) {
  var t, r, n, i, o, a, s, l = 0, d = null, c, f, p;
  if (t = xc.exec(e), t === null && (t = Lc.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], f = +(t[11] || 0), d = (c * 60 + f) * 6e4, t[9] === "-" && (d = -d)), p = new Date(Date.UTC(r, n, i, o, a, s, l)), d && p.setTime(p.getTime() - d), p;
}
function Wm(e) {
  return e.toISOString();
}
var Uc = new Hm("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: qm,
  construct: Gm,
  instanceOf: Date,
  represent: Wm
}), Vm = De;
function Ym(e) {
  return e === "<<" || e === null;
}
var kc = new Vm("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Ym
}), zm = De, Lo = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Xm(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, o = Lo;
  for (r = 0; r < i; r++)
    if (t = o.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function Km(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, o = Lo, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : r === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : r === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function Jm(e) {
  var t = "", r = 0, n, i, o = e.length, a = Lo;
  for (n = 0; n < o; n++)
    n % 3 === 0 && n && (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]), r = (r << 8) + e[n];
  return i = o % 3, i === 0 ? (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]) : i === 2 ? (t += a[r >> 10 & 63], t += a[r >> 4 & 63], t += a[r << 2 & 63], t += a[64]) : i === 1 && (t += a[r >> 2 & 63], t += a[r << 4 & 63], t += a[64], t += a[64]), t;
}
function Qm(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Mc = new zm("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Xm,
  construct: Km,
  predicate: Qm,
  represent: Jm
}), Zm = De, e0 = Object.prototype.hasOwnProperty, t0 = Object.prototype.toString;
function r0(e) {
  if (e === null) return !0;
  var t = [], r, n, i, o, a, s = e;
  for (r = 0, n = s.length; r < n; r += 1) {
    if (i = s[r], a = !1, t0.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (e0.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function n0(e) {
  return e !== null ? e : [];
}
var Bc = new Zm("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: r0,
  construct: n0
}), i0 = De, o0 = Object.prototype.toString;
function a0(e) {
  if (e === null) return !0;
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1) {
    if (n = a[t], o0.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    o[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function s0(e) {
  if (e === null) return [];
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1)
    n = a[t], i = Object.keys(n), o[t] = [i[0], n[i[0]]];
  return o;
}
var jc = new i0("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: a0,
  construct: s0
}), l0 = De, c0 = Object.prototype.hasOwnProperty;
function u0(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (c0.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function f0(e) {
  return e !== null ? e : {};
}
var Hc = new l0("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: u0,
  construct: f0
}), Uo = Fc.extend({
  implicit: [
    Uc,
    kc
  ],
  explicit: [
    Mc,
    Bc,
    jc,
    Hc
  ]
}), Nt = Ge, qc = Kr, d0 = cm, h0 = Uo, vt = Object.prototype.hasOwnProperty, Bn = 1, Gc = 2, Wc = 3, jn = 4, Fi = 1, p0 = 2, Ja = 3, m0 = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, g0 = /[\x85\u2028\u2029]/, y0 = /[,\[\]\{\}]/, Vc = /^(?:!|!!|![a-z\-]+!)$/i, Yc = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Qa(e) {
  return Object.prototype.toString.call(e);
}
function Ke(e) {
  return e === 10 || e === 13;
}
function xt(e) {
  return e === 9 || e === 32;
}
function xe(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function Xt(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function E0(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function v0(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function w0(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Za(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function _0(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function zc(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var Xc = new Array(256), Kc = new Array(256);
for (var qt = 0; qt < 256; qt++)
  Xc[qt] = Za(qt) ? 1 : 0, Kc[qt] = Za(qt);
function S0(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || h0, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Jc(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = d0(r), new qc(t, r);
}
function L(e, t) {
  throw Jc(e, t);
}
function Hn(e, t) {
  e.onWarning && e.onWarning.call(null, Jc(e, t));
}
var es = {
  YAML: function(t, r, n) {
    var i, o, a;
    t.version !== null && L(t, "duplication of %YAML directive"), n.length !== 1 && L(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && L(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && L(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && Hn(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, o;
    n.length !== 2 && L(t, "TAG directive accepts exactly two arguments"), i = n[0], o = n[1], Vc.test(i) || L(t, "ill-formed tag handle (first argument) of the TAG directive"), vt.call(t.tagMap, i) && L(t, 'there is a previously declared suffix for "' + i + '" tag handle'), Yc.test(o) || L(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      L(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function gt(e, t, r, n) {
  var i, o, a, s;
  if (t < r) {
    if (s = e.input.slice(t, r), n)
      for (i = 0, o = s.length; i < o; i += 1)
        a = s.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || L(e, "expected valid JSON character");
    else m0.test(s) && L(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function ts(e, t, r, n) {
  var i, o, a, s;
  for (Nt.isObject(r) || L(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), a = 0, s = i.length; a < s; a += 1)
    o = i[a], vt.call(t, o) || (zc(t, o, r[o]), n[o] = !0);
}
function Kt(e, t, r, n, i, o, a, s, l) {
  var d, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), d = 0, c = i.length; d < c; d += 1)
      Array.isArray(i[d]) && L(e, "nested arrays are not supported inside keys"), typeof i == "object" && Qa(i[d]) === "[object Object]" && (i[d] = "[object Object]");
  if (typeof i == "object" && Qa(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (d = 0, c = o.length; d < c; d += 1)
        ts(e, t, o[d], r);
    else
      ts(e, t, o, r);
  else
    !e.json && !vt.call(r, i) && vt.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, L(e, "duplicated mapping key")), zc(t, i, o), delete r[i];
  return t;
}
function ko(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : L(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function ce(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; xt(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (Ke(i))
      for (ko(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && Hn(e, "deficient indentation"), n;
}
function Qn(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || xe(r)));
}
function Mo(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Nt.repeat(`
`, t - 1));
}
function A0(e, t, r) {
  var n, i, o, a, s, l, d, c, f = e.kind, p = e.result, g;
  if (g = e.input.charCodeAt(e.position), xe(g) || Xt(g) || g === 35 || g === 38 || g === 42 || g === 33 || g === 124 || g === 62 || g === 39 || g === 34 || g === 37 || g === 64 || g === 96 || (g === 63 || g === 45) && (i = e.input.charCodeAt(e.position + 1), xe(i) || r && Xt(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; g !== 0; ) {
    if (g === 58) {
      if (i = e.input.charCodeAt(e.position + 1), xe(i) || r && Xt(i))
        break;
    } else if (g === 35) {
      if (n = e.input.charCodeAt(e.position - 1), xe(n))
        break;
    } else {
      if (e.position === e.lineStart && Qn(e) || r && Xt(g))
        break;
      if (Ke(g))
        if (l = e.line, d = e.lineStart, c = e.lineIndent, ce(e, !1, -1), e.lineIndent >= t) {
          s = !0, g = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = d, e.lineIndent = c;
          break;
        }
    }
    s && (gt(e, o, a, !1), Mo(e, e.line - l), o = a = e.position, s = !1), xt(g) || (a = e.position + 1), g = e.input.charCodeAt(++e.position);
  }
  return gt(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = p, !1);
}
function T0(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (gt(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else Ke(r) ? (gt(e, n, i, !0), Mo(e, ce(e, !1, t)), n = i = e.position) : e.position === e.lineStart && Qn(e) ? L(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  L(e, "unexpected end of the stream within a single quoted scalar");
}
function b0(e, t) {
  var r, n, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return gt(e, r, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (gt(e, r, e.position, !0), s = e.input.charCodeAt(++e.position), Ke(s))
        ce(e, !1, t);
      else if (s < 256 && Xc[s])
        e.result += Kc[s], e.position++;
      else if ((a = v0(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = E0(s)) >= 0 ? o = (o << 4) + a : L(e, "expected hexadecimal character");
        e.result += _0(o), e.position++;
      } else
        L(e, "unknown escape sequence");
      r = n = e.position;
    } else Ke(s) ? (gt(e, r, n, !0), Mo(e, ce(e, !1, t)), r = n = e.position) : e.position === e.lineStart && Qn(e) ? L(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  L(e, "unexpected end of the stream within a double quoted scalar");
}
function C0(e, t) {
  var r = !0, n, i, o, a = e.tag, s, l = e.anchor, d, c, f, p, g, _ = /* @__PURE__ */ Object.create(null), E, S, A, T;
  if (T = e.input.charCodeAt(e.position), T === 91)
    c = 93, g = !1, s = [];
  else if (T === 123)
    c = 125, g = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), T = e.input.charCodeAt(++e.position); T !== 0; ) {
    if (ce(e, !0, t), T = e.input.charCodeAt(e.position), T === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = g ? "mapping" : "sequence", e.result = s, !0;
    r ? T === 44 && L(e, "expected the node content, but found ','") : L(e, "missed comma between flow collection entries"), S = E = A = null, f = p = !1, T === 63 && (d = e.input.charCodeAt(e.position + 1), xe(d) && (f = p = !0, e.position++, ce(e, !0, t))), n = e.line, i = e.lineStart, o = e.position, or(e, t, Bn, !1, !0), S = e.tag, E = e.result, ce(e, !0, t), T = e.input.charCodeAt(e.position), (p || e.line === n) && T === 58 && (f = !0, T = e.input.charCodeAt(++e.position), ce(e, !0, t), or(e, t, Bn, !1, !0), A = e.result), g ? Kt(e, s, _, S, E, A, n, i, o) : f ? s.push(Kt(e, null, _, S, E, A, n, i, o)) : s.push(E), ce(e, !0, t), T = e.input.charCodeAt(e.position), T === 44 ? (r = !0, T = e.input.charCodeAt(++e.position)) : r = !1;
  }
  L(e, "unexpected end of the stream within a flow collection");
}
function O0(e, t) {
  var r, n, i = Fi, o = !1, a = !1, s = t, l = 0, d = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    n = !1;
  else if (f === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      Fi === i ? i = f === 43 ? Ja : p0 : L(e, "repeat of a chomping mode identifier");
    else if ((c = w0(f)) >= 0)
      c === 0 ? L(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? L(e, "repeat of an indentation width identifier") : (s = t + c - 1, a = !0);
    else
      break;
  if (xt(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (xt(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!Ke(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (ko(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), Ke(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === Ja ? e.result += Nt.repeat(`
`, o ? 1 + l : l) : i === Fi && o && (e.result += `
`);
      break;
    }
    for (n ? xt(f) ? (d = !0, e.result += Nt.repeat(`
`, o ? 1 + l : l)) : d ? (d = !1, e.result += Nt.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += Nt.repeat(`
`, l) : e.result += Nt.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, r = e.position; !Ke(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    gt(e, r, e.position, !1);
  }
  return !0;
}
function rs(e, t) {
  var r, n = e.tag, i = e.anchor, o = [], a, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !xe(a)))); ) {
    if (s = !0, e.position++, ce(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, or(e, t, Wc, !1, !0), o.push(e.result), ce(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      L(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function P0(e, t, r) {
  var n, i, o, a, s, l, d = e.tag, c = e.anchor, f = {}, p = /* @__PURE__ */ Object.create(null), g = null, _ = null, E = null, S = !1, A = !1, T;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), T = e.input.charCodeAt(e.position); T !== 0; ) {
    if (!S && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, L(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), o = e.line, (T === 63 || T === 58) && xe(n))
      T === 63 ? (S && (Kt(e, f, p, g, _, null, a, s, l), g = _ = E = null), A = !0, S = !0, i = !0) : S ? (S = !1, i = !0) : L(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, T = n;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !or(e, r, Gc, !1, !0))
        break;
      if (e.line === o) {
        for (T = e.input.charCodeAt(e.position); xt(T); )
          T = e.input.charCodeAt(++e.position);
        if (T === 58)
          T = e.input.charCodeAt(++e.position), xe(T) || L(e, "a whitespace character is expected after the key-value separator within a block mapping"), S && (Kt(e, f, p, g, _, null, a, s, l), g = _ = E = null), A = !0, S = !1, i = !1, g = e.tag, _ = e.result;
        else if (A)
          L(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = d, e.anchor = c, !0;
      } else if (A)
        L(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = d, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (S && (a = e.line, s = e.lineStart, l = e.position), or(e, t, jn, !0, i) && (S ? _ = e.result : E = e.result), S || (Kt(e, f, p, g, _, E, a, s, l), g = _ = E = null), ce(e, !0, -1), T = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && T !== 0)
      L(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return S && Kt(e, f, p, g, _, null, a, s, l), A && (e.tag = d, e.anchor = c, e.kind = "mapping", e.result = f), A;
}
function I0(e) {
  var t, r = !1, n = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && L(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (r = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (n = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : L(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !xe(a); )
      a === 33 && (n ? L(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), Vc.test(i) || L(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), y0.test(o) && L(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !Yc.test(o) && L(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    L(e, "tag name is malformed: " + o);
  }
  return r ? e.tag = o : vt.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : L(e, 'undeclared tag handle "' + i + '"'), !0;
}
function R0(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && L(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !xe(r) && !Xt(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function D0(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !xe(n) && !Xt(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && L(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), vt.call(e.anchorMap, r) || L(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], ce(e, !0, -1), !0;
}
function or(e, t, r, n, i) {
  var o, a, s, l = 1, d = !1, c = !1, f, p, g, _, E, S;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = jn === r || Wc === r, n && ce(e, !0, -1) && (d = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; I0(e) || R0(e); )
      ce(e, !0, -1) ? (d = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = d || i), (l === 1 || jn === r) && (Bn === r || Gc === r ? E = t : E = t + 1, S = e.position - e.lineStart, l === 1 ? s && (rs(e, S) || P0(e, S, E)) || C0(e, E) ? c = !0 : (a && O0(e, E) || T0(e, E) || b0(e, E) ? c = !0 : D0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && L(e, "alias node should not have any properties")) : A0(e, E, Bn === r) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && rs(e, S))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && L(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, p = e.implicitTypes.length; f < p; f += 1)
      if (_ = e.implicitTypes[f], _.resolve(e.result)) {
        e.result = _.construct(e.result), e.tag = _.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (vt.call(e.typeMap[e.kind || "fallback"], e.tag))
      _ = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (_ = null, g = e.typeMap.multi[e.kind || "fallback"], f = 0, p = g.length; f < p; f += 1)
        if (e.tag.slice(0, g[f].tag.length) === g[f].tag) {
          _ = g[f];
          break;
        }
    _ || L(e, "unknown tag !<" + e.tag + ">"), e.result !== null && _.kind !== e.kind && L(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + _.kind + '", not "' + e.kind + '"'), _.resolve(e.result, e.tag) ? (e.result = _.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : L(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function N0(e) {
  var t = e.position, r, n, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (ce(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), r = e.position; a !== 0 && !xe(a); )
      a = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && L(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; xt(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !Ke(a));
        break;
      }
      if (Ke(a)) break;
      for (r = e.position; a !== 0 && !xe(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    a !== 0 && ko(e), vt.call(es, n) ? es[n](e, n, i) : Hn(e, 'unknown document directive "' + n + '"');
  }
  if (ce(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, ce(e, !0, -1)) : o && L(e, "directives end mark is expected"), or(e, e.lineIndent - 1, jn, !1, !0), ce(e, !0, -1), e.checkLineBreaks && g0.test(e.input.slice(t, e.position)) && Hn(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Qn(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, ce(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    L(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Qc(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new S0(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, L(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    N0(r);
  return r.documents;
}
function $0(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = Qc(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, o = n.length; i < o; i += 1)
    t(n[i]);
}
function F0(e, t) {
  var r = Qc(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new qc("expected a single document in the stream, but found more");
  }
}
xo.loadAll = $0;
xo.load = F0;
var Zc = {}, Zn = Ge, Jr = Kr, x0 = Uo, eu = Object.prototype.toString, tu = Object.prototype.hasOwnProperty, Bo = 65279, L0 = 9, xr = 10, U0 = 13, k0 = 32, M0 = 33, B0 = 34, lo = 35, j0 = 37, H0 = 38, q0 = 39, G0 = 42, ru = 44, W0 = 45, qn = 58, V0 = 61, Y0 = 62, z0 = 63, X0 = 64, nu = 91, iu = 93, K0 = 96, ou = 123, J0 = 124, au = 125, Te = {};
Te[0] = "\\0";
Te[7] = "\\a";
Te[8] = "\\b";
Te[9] = "\\t";
Te[10] = "\\n";
Te[11] = "\\v";
Te[12] = "\\f";
Te[13] = "\\r";
Te[27] = "\\e";
Te[34] = '\\"';
Te[92] = "\\\\";
Te[133] = "\\N";
Te[160] = "\\_";
Te[8232] = "\\L";
Te[8233] = "\\P";
var Q0 = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], Z0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function eg(e, t) {
  var r, n, i, o, a, s, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, o = n.length; i < o; i += 1)
    a = n[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && tu.call(l.styleAliases, s) && (s = l.styleAliases[s]), r[a] = s;
  return r;
}
function tg(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new Jr("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + Zn.repeat("0", n - t.length) + t;
}
var rg = 1, Lr = 2;
function ng(e) {
  this.schema = e.schema || x0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Zn.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = eg(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Lr : rg, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function ns(e, t) {
  for (var r = Zn.repeat(" ", t), n = 0, i = -1, o = "", a, s = e.length; n < s; )
    i = e.indexOf(`
`, n), i === -1 ? (a = e.slice(n), n = s) : (a = e.slice(n, i + 1), n = i + 1), a.length && a !== `
` && (o += r), o += a;
  return o;
}
function co(e, t) {
  return `
` + Zn.repeat(" ", e.indent * t);
}
function ig(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function Gn(e) {
  return e === k0 || e === L0;
}
function Ur(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Bo || 65536 <= e && e <= 1114111;
}
function is(e) {
  return Ur(e) && e !== Bo && e !== U0 && e !== xr;
}
function os(e, t, r) {
  var n = is(e), i = n && !Gn(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== ru && e !== nu && e !== iu && e !== ou && e !== au) && e !== lo && !(t === qn && !i) || is(t) && !Gn(t) && e === lo || t === qn && i
  );
}
function og(e) {
  return Ur(e) && e !== Bo && !Gn(e) && e !== W0 && e !== z0 && e !== qn && e !== ru && e !== nu && e !== iu && e !== ou && e !== au && e !== lo && e !== H0 && e !== G0 && e !== M0 && e !== J0 && e !== V0 && e !== Y0 && e !== q0 && e !== B0 && e !== j0 && e !== X0 && e !== K0;
}
function ag(e) {
  return !Gn(e) && e !== qn;
}
function Tr(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function su(e) {
  var t = /^\n* /;
  return t.test(e);
}
var lu = 1, uo = 2, cu = 3, uu = 4, zt = 5;
function sg(e, t, r, n, i, o, a, s) {
  var l, d = 0, c = null, f = !1, p = !1, g = n !== -1, _ = -1, E = og(Tr(e, 0)) && ag(Tr(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = Tr(e, l), !Ur(d))
        return zt;
      E = E && os(d, c, s), c = d;
    }
  else {
    for (l = 0; l < e.length; d >= 65536 ? l += 2 : l++) {
      if (d = Tr(e, l), d === xr)
        f = !0, g && (p = p || // Foldable line = too long, and not more-indented.
        l - _ - 1 > n && e[_ + 1] !== " ", _ = l);
      else if (!Ur(d))
        return zt;
      E = E && os(d, c, s), c = d;
    }
    p = p || g && l - _ - 1 > n && e[_ + 1] !== " ";
  }
  return !f && !p ? E && !a && !i(e) ? lu : o === Lr ? zt : uo : r > 9 && su(e) ? zt : a ? o === Lr ? zt : uo : p ? uu : cu;
}
function lg(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Lr ? '""' : "''";
    if (!e.noCompatMode && (Q0.indexOf(t) !== -1 || Z0.test(t)))
      return e.quotingType === Lr ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, r), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(d) {
      return ig(e, d);
    }
    switch (sg(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case lu:
        return t;
      case uo:
        return "'" + t.replace(/'/g, "''") + "'";
      case cu:
        return "|" + as(t, e.indent) + ss(ns(t, o));
      case uu:
        return ">" + as(t, e.indent) + ss(ns(cg(t, a), o));
      case zt:
        return '"' + ug(t) + '"';
      default:
        throw new Jr("impossible error: invalid scalar style");
    }
  }();
}
function as(e, t) {
  var r = su(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : n ? "" : "-";
  return r + o + `
`;
}
function ss(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function cg(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var d = e.indexOf(`
`);
    return d = d !== -1 ? d : e.length, r.lastIndex = d, ls(e.slice(0, d), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = r.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", n += s + (!i && !o && l !== "" ? `
` : "") + ls(l, t), i = o;
  }
  return n;
}
function ls(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, o, a = 0, s = 0, l = ""; n = r.exec(e); )
    s = n.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function ug(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = Tr(e, i), n = Te[r], !n && Ur(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || tg(r);
  return t;
}
function fg(e, t, r) {
  var n = "", i = e.tag, o, a, s;
  for (o = 0, a = r.length; o < a; o += 1)
    s = r[o], e.replacer && (s = e.replacer.call(r, String(o), s)), (rt(e, t, s, !1, !1) || typeof s > "u" && rt(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function cs(e, t, r, n) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = r.length; a < s; a += 1)
    l = r[a], e.replacer && (l = e.replacer.call(r, String(a), l)), (rt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && rt(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += co(e, t)), e.dump && xr === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function dg(e, t, r) {
  var n = "", i = e.tag, o = Object.keys(r), a, s, l, d, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", n !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], d = r[l], e.replacer && (d = e.replacer.call(r, l, d)), rt(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), rt(e, t, d, !1, !1) && (c += e.dump, n += c));
  e.tag = i, e.dump = "{" + n + "}";
}
function hg(e, t, r, n) {
  var i = "", o = e.tag, a = Object.keys(r), s, l, d, c, f, p;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new Jr("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    p = "", (!n || i !== "") && (p += co(e, t)), d = a[s], c = r[d], e.replacer && (c = e.replacer.call(r, d, c)), rt(e, t + 1, d, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && xr === e.dump.charCodeAt(0) ? p += "?" : p += "? "), p += e.dump, f && (p += co(e, t)), rt(e, t + 1, c, !0, f) && (e.dump && xr === e.dump.charCodeAt(0) ? p += ":" : p += ": ", p += e.dump, i += p));
  e.tag = o, e.dump = i || "{}";
}
function us(e, t, r) {
  var n, i, o, a, s, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (r ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, eu.call(s.represent) === "[object Function]")
          n = s.represent(t, l);
        else if (tu.call(s.represent, l))
          n = s.represent[l](t, l);
        else
          throw new Jr("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function rt(e, t, r, n, i, o, a) {
  e.tag = null, e.dump = r, us(e, r, !1) || us(e, r, !0);
  var s = eu.call(e.dump), l = n, d;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, p;
  if (c && (f = e.duplicates.indexOf(r), p = f !== -1), (e.tag !== null && e.tag !== "?" || p || e.indent !== 2 && t > 0) && (i = !1), p && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && p && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (hg(e, t, e.dump, i), p && (e.dump = "&ref_" + f + e.dump)) : (dg(e, t, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? cs(e, t - 1, e.dump, i) : cs(e, t, e.dump, i), p && (e.dump = "&ref_" + f + e.dump)) : (fg(e, t, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && lg(e, e.dump, t, o, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new Jr("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (d = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? d = "!" + d : d.slice(0, 18) === "tag:yaml.org,2002:" ? d = "!!" + d.slice(18) : d = "!<" + d + ">", e.dump = d + " " + e.dump);
  }
  return !0;
}
function pg(e, t) {
  var r = [], n = [], i, o;
  for (fo(e, r, n), i = 0, o = n.length; i < o; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(o);
}
function fo(e, t, r) {
  var n, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        fo(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, o = n.length; i < o; i += 1)
        fo(e[n[i]], t, r);
}
function mg(e, t) {
  t = t || {};
  var r = new ng(t);
  r.noRefs || pg(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), rt(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
Zc.dump = mg;
var fu = xo, gg = Zc;
function jo(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
we.Type = De;
we.Schema = Ac;
we.FAILSAFE_SCHEMA = Oc;
we.JSON_SCHEMA = $c;
we.CORE_SCHEMA = Fc;
we.DEFAULT_SCHEMA = Uo;
we.load = fu.load;
we.loadAll = fu.loadAll;
we.dump = gg.dump;
we.YAMLException = Kr;
we.types = {
  binary: Mc,
  float: Nc,
  map: Cc,
  null: Pc,
  pairs: jc,
  set: Hc,
  timestamp: Uc,
  bool: Ic,
  int: Rc,
  merge: kc,
  omap: Bc,
  seq: bc,
  str: Tc
};
we.safeLoad = jo("safeLoad", "load");
we.safeLoadAll = jo("safeLoadAll", "loadAll");
we.safeDump = jo("safeDump", "dump");
var ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
ei.Lazy = void 0;
class yg {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
ei.Lazy = yg;
var ho = { exports: {} };
const Eg = "2.0.0", du = 256, vg = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, wg = 16, _g = du - 6, Sg = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var ti = {
  MAX_LENGTH: du,
  MAX_SAFE_COMPONENT_LENGTH: wg,
  MAX_SAFE_BUILD_LENGTH: _g,
  MAX_SAFE_INTEGER: vg,
  RELEASE_TYPES: Sg,
  SEMVER_SPEC_VERSION: Eg,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Ag = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ri = Ag;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = ti, o = ri;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], l = t.src = [], d = t.safeSrc = [], c = t.t = {};
  let f = 0;
  const p = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", i],
    [p, n]
  ], _ = (S) => {
    for (const [A, T] of g)
      S = S.split(`${A}*`).join(`${A}{0,${T}}`).split(`${A}+`).join(`${A}{1,${T}}`);
    return S;
  }, E = (S, A, T) => {
    const $ = _(A), x = f++;
    o(S, x, A), c[S] = x, l[x] = A, d[x] = $, a[x] = new RegExp(A, T ? "g" : void 0), s[x] = new RegExp($, T ? "g" : void 0);
  };
  E("NUMERICIDENTIFIER", "0|[1-9]\\d*"), E("NUMERICIDENTIFIERLOOSE", "\\d+"), E("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${p}*`), E("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), E("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), E("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), E("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), E("BUILDIDENTIFIER", `${p}+`), E("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), E("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), E("FULL", `^${l[c.FULLPLAIN]}$`), E("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), E("LOOSE", `^${l[c.LOOSEPLAIN]}$`), E("GTLT", "((?:<|>)?=?)"), E("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), E("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), E("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), E("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), E("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), E("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), E("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), E("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), E("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), E("COERCERTL", l[c.COERCE], !0), E("COERCERTLFULL", l[c.COERCEFULL], !0), E("LONETILDE", "(?:~>?)"), E("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", E("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), E("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), E("LONECARET", "(?:\\^)"), E("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", E("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), E("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), E("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), E("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), E("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", E("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), E("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), E("STAR", "(<|>)?=?\\s*\\*"), E("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), E("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(ho, ho.exports);
var Qr = ho.exports;
const Tg = Object.freeze({ loose: !0 }), bg = Object.freeze({}), Cg = (e) => e ? typeof e != "object" ? Tg : e : bg;
var Ho = Cg;
const fs = /^[0-9]+$/, hu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = fs.test(e), n = fs.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, Og = (e, t) => hu(t, e);
var pu = {
  compareIdentifiers: hu,
  rcompareIdentifiers: Og
};
const wn = ri, { MAX_LENGTH: ds, MAX_SAFE_INTEGER: _n } = ti, { safeRe: Sn, t: An } = Qr, Pg = Ho, { compareIdentifiers: xi } = pu;
let Ig = class Xe {
  constructor(t, r) {
    if (r = Pg(r), t instanceof Xe) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > ds)
      throw new TypeError(
        `version is longer than ${ds} characters`
      );
    wn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Sn[An.LOOSE] : Sn[An.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > _n || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > _n || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > _n || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < _n)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (wn("SemVer.compare", this.version, this.options, t), !(t instanceof Xe)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Xe(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Xe || (t = new Xe(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof Xe || (t = new Xe(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (wn("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return xi(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Xe || (t = new Xe(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (wn("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return xi(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Sn[An.PRERELEASELOOSE] : Sn[An.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let o = [r, i];
          n === !1 && (o = [r]), xi(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ne = Ig;
const hs = Ne, Rg = (e, t, r = !1) => {
  if (e instanceof hs)
    return e;
  try {
    return new hs(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var ur = Rg;
const Dg = ur, Ng = (e, t) => {
  const r = Dg(e, t);
  return r ? r.version : null;
};
var $g = Ng;
const Fg = ur, xg = (e, t) => {
  const r = Fg(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var Lg = xg;
const ps = Ne, Ug = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new ps(
      e instanceof ps ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var kg = Ug;
const ms = ur, Mg = (e, t) => {
  const r = ms(e, null, !0), n = ms(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const o = i > 0, a = o ? r : n, s = o ? n : r, l = !!a.prerelease.length;
  if (!!s.prerelease.length && !l) {
    if (!s.patch && !s.minor)
      return "major";
    if (s.compareMain(a) === 0)
      return s.minor && !s.patch ? "minor" : "patch";
  }
  const c = l ? "pre" : "";
  return r.major !== n.major ? c + "major" : r.minor !== n.minor ? c + "minor" : r.patch !== n.patch ? c + "patch" : "prerelease";
};
var Bg = Mg;
const jg = Ne, Hg = (e, t) => new jg(e, t).major;
var qg = Hg;
const Gg = Ne, Wg = (e, t) => new Gg(e, t).minor;
var Vg = Wg;
const Yg = Ne, zg = (e, t) => new Yg(e, t).patch;
var Xg = zg;
const Kg = ur, Jg = (e, t) => {
  const r = Kg(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var Qg = Jg;
const gs = Ne, Zg = (e, t, r) => new gs(e, r).compare(new gs(t, r));
var We = Zg;
const ey = We, ty = (e, t, r) => ey(t, e, r);
var ry = ty;
const ny = We, iy = (e, t) => ny(e, t, !0);
var oy = iy;
const ys = Ne, ay = (e, t, r) => {
  const n = new ys(e, r), i = new ys(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var qo = ay;
const sy = qo, ly = (e, t) => e.sort((r, n) => sy(r, n, t));
var cy = ly;
const uy = qo, fy = (e, t) => e.sort((r, n) => uy(n, r, t));
var dy = fy;
const hy = We, py = (e, t, r) => hy(e, t, r) > 0;
var ni = py;
const my = We, gy = (e, t, r) => my(e, t, r) < 0;
var Go = gy;
const yy = We, Ey = (e, t, r) => yy(e, t, r) === 0;
var mu = Ey;
const vy = We, wy = (e, t, r) => vy(e, t, r) !== 0;
var gu = wy;
const _y = We, Sy = (e, t, r) => _y(e, t, r) >= 0;
var Wo = Sy;
const Ay = We, Ty = (e, t, r) => Ay(e, t, r) <= 0;
var Vo = Ty;
const by = mu, Cy = gu, Oy = ni, Py = Wo, Iy = Go, Ry = Vo, Dy = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return by(e, r, n);
    case "!=":
      return Cy(e, r, n);
    case ">":
      return Oy(e, r, n);
    case ">=":
      return Py(e, r, n);
    case "<":
      return Iy(e, r, n);
    case "<=":
      return Ry(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var yu = Dy;
const Ny = Ne, $y = ur, { safeRe: Tn, t: bn } = Qr, Fy = (e, t) => {
  if (e instanceof Ny)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Tn[bn.COERCEFULL] : Tn[bn.COERCE]);
  else {
    const l = t.includePrerelease ? Tn[bn.COERCERTLFULL] : Tn[bn.COERCERTL];
    let d;
    for (; (d = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), l.lastIndex = d.index + d[1].length + d[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", s = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return $y(`${n}.${i}.${o}${a}${s}`, t);
};
var xy = Fy;
class Ly {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var Uy = Ly, Li, Es;
function Ve() {
  if (Es) return Li;
  Es = 1;
  const e = /\s+/g;
  class t {
    constructor(O, D) {
      if (D = i(D), O instanceof t)
        return O.loose === !!D.loose && O.includePrerelease === !!D.includePrerelease ? O : new t(O.raw, D);
      if (O instanceof o)
        return this.raw = O.value, this.set = [[O]], this.formatted = void 0, this;
      if (this.options = D, this.loose = !!D.loose, this.includePrerelease = !!D.includePrerelease, this.raw = O.trim().replace(e, " "), this.set = this.raw.split("||").map((C) => this.parseRange(C.trim())).filter((C) => C.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const C = this.set[0];
        if (this.set = this.set.filter((N) => !E(N[0])), this.set.length === 0)
          this.set = [C];
        else if (this.set.length > 1) {
          for (const N of this.set)
            if (N.length === 1 && S(N[0])) {
              this.set = [N];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let O = 0; O < this.set.length; O++) {
          O > 0 && (this.formatted += "||");
          const D = this.set[O];
          for (let C = 0; C < D.length; C++)
            C > 0 && (this.formatted += " "), this.formatted += D[C].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(O) {
      const C = ((this.options.includePrerelease && g) | (this.options.loose && _)) + ":" + O, N = n.get(C);
      if (N)
        return N;
      const R = this.options.loose, k = R ? l[d.HYPHENRANGELOOSE] : l[d.HYPHENRANGE];
      O = O.replace(k, M(this.options.includePrerelease)), a("hyphen replace", O), O = O.replace(l[d.COMPARATORTRIM], c), a("comparator trim", O), O = O.replace(l[d.TILDETRIM], f), a("tilde trim", O), O = O.replace(l[d.CARETTRIM], p), a("caret trim", O);
      let G = O.split(" ").map((U) => T(U, this.options)).join(" ").split(/\s+/).map((U) => B(U, this.options));
      R && (G = G.filter((U) => (a("loose invalid filter", U, this.options), !!U.match(l[d.COMPARATORLOOSE])))), a("range list", G);
      const j = /* @__PURE__ */ new Map(), X = G.map((U) => new o(U, this.options));
      for (const U of X) {
        if (E(U))
          return [U];
        j.set(U.value, U);
      }
      j.size > 1 && j.has("") && j.delete("");
      const he = [...j.values()];
      return n.set(C, he), he;
    }
    intersects(O, D) {
      if (!(O instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((C) => A(C, D) && O.set.some((N) => A(N, D) && C.every((R) => N.every((k) => R.intersects(k, D)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(O) {
      if (!O)
        return !1;
      if (typeof O == "string")
        try {
          O = new s(O, this.options);
        } catch {
          return !1;
        }
      for (let D = 0; D < this.set.length; D++)
        if (z(this.set[D], O, this.options))
          return !0;
      return !1;
    }
  }
  Li = t;
  const r = Uy, n = new r(), i = Ho, o = ii(), a = ri, s = Ne, {
    safeRe: l,
    t: d,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: p
  } = Qr, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: _ } = ti, E = (I) => I.value === "<0.0.0-0", S = (I) => I.value === "", A = (I, O) => {
    let D = !0;
    const C = I.slice();
    let N = C.pop();
    for (; D && C.length; )
      D = C.every((R) => N.intersects(R, O)), N = C.pop();
    return D;
  }, T = (I, O) => (I = I.replace(l[d.BUILD], ""), a("comp", I, O), I = se(I, O), a("caret", I), I = x(I, O), a("tildes", I), I = Le(I, O), a("xrange", I), I = q(I, O), a("stars", I), I), $ = (I) => !I || I.toLowerCase() === "x" || I === "*", x = (I, O) => I.trim().split(/\s+/).map((D) => te(D, O)).join(" "), te = (I, O) => {
    const D = O.loose ? l[d.TILDELOOSE] : l[d.TILDE];
    return I.replace(D, (C, N, R, k, G) => {
      a("tilde", I, C, N, R, k, G);
      let j;
      return $(N) ? j = "" : $(R) ? j = `>=${N}.0.0 <${+N + 1}.0.0-0` : $(k) ? j = `>=${N}.${R}.0 <${N}.${+R + 1}.0-0` : G ? (a("replaceTilde pr", G), j = `>=${N}.${R}.${k}-${G} <${N}.${+R + 1}.0-0`) : j = `>=${N}.${R}.${k} <${N}.${+R + 1}.0-0`, a("tilde return", j), j;
    });
  }, se = (I, O) => I.trim().split(/\s+/).map((D) => V(D, O)).join(" "), V = (I, O) => {
    a("caret", I, O);
    const D = O.loose ? l[d.CARETLOOSE] : l[d.CARET], C = O.includePrerelease ? "-0" : "";
    return I.replace(D, (N, R, k, G, j) => {
      a("caret", I, N, R, k, G, j);
      let X;
      return $(R) ? X = "" : $(k) ? X = `>=${R}.0.0${C} <${+R + 1}.0.0-0` : $(G) ? R === "0" ? X = `>=${R}.${k}.0${C} <${R}.${+k + 1}.0-0` : X = `>=${R}.${k}.0${C} <${+R + 1}.0.0-0` : j ? (a("replaceCaret pr", j), R === "0" ? k === "0" ? X = `>=${R}.${k}.${G}-${j} <${R}.${k}.${+G + 1}-0` : X = `>=${R}.${k}.${G}-${j} <${R}.${+k + 1}.0-0` : X = `>=${R}.${k}.${G}-${j} <${+R + 1}.0.0-0`) : (a("no pr"), R === "0" ? k === "0" ? X = `>=${R}.${k}.${G}${C} <${R}.${k}.${+G + 1}-0` : X = `>=${R}.${k}.${G}${C} <${R}.${+k + 1}.0-0` : X = `>=${R}.${k}.${G} <${+R + 1}.0.0-0`), a("caret return", X), X;
    });
  }, Le = (I, O) => (a("replaceXRanges", I, O), I.split(/\s+/).map((D) => y(D, O)).join(" ")), y = (I, O) => {
    I = I.trim();
    const D = O.loose ? l[d.XRANGELOOSE] : l[d.XRANGE];
    return I.replace(D, (C, N, R, k, G, j) => {
      a("xRange", I, C, N, R, k, G, j);
      const X = $(R), he = X || $(k), U = he || $(G), Ye = U;
      return N === "=" && Ye && (N = ""), j = O.includePrerelease ? "-0" : "", X ? N === ">" || N === "<" ? C = "<0.0.0-0" : C = "*" : N && Ye ? (he && (k = 0), G = 0, N === ">" ? (N = ">=", he ? (R = +R + 1, k = 0, G = 0) : (k = +k + 1, G = 0)) : N === "<=" && (N = "<", he ? R = +R + 1 : k = +k + 1), N === "<" && (j = "-0"), C = `${N + R}.${k}.${G}${j}`) : he ? C = `>=${R}.0.0${j} <${+R + 1}.0.0-0` : U && (C = `>=${R}.${k}.0${j} <${R}.${+k + 1}.0-0`), a("xRange return", C), C;
    });
  }, q = (I, O) => (a("replaceStars", I, O), I.trim().replace(l[d.STAR], "")), B = (I, O) => (a("replaceGTE0", I, O), I.trim().replace(l[O.includePrerelease ? d.GTE0PRE : d.GTE0], "")), M = (I) => (O, D, C, N, R, k, G, j, X, he, U, Ye) => ($(C) ? D = "" : $(N) ? D = `>=${C}.0.0${I ? "-0" : ""}` : $(R) ? D = `>=${C}.${N}.0${I ? "-0" : ""}` : k ? D = `>=${D}` : D = `>=${D}${I ? "-0" : ""}`, $(X) ? j = "" : $(he) ? j = `<${+X + 1}.0.0-0` : $(U) ? j = `<${X}.${+he + 1}.0-0` : Ye ? j = `<=${X}.${he}.${U}-${Ye}` : I ? j = `<${X}.${he}.${+U + 1}-0` : j = `<=${j}`, `${D} ${j}`.trim()), z = (I, O, D) => {
    for (let C = 0; C < I.length; C++)
      if (!I[C].test(O))
        return !1;
    if (O.prerelease.length && !D.includePrerelease) {
      for (let C = 0; C < I.length; C++)
        if (a(I[C].semver), I[C].semver !== o.ANY && I[C].semver.prerelease.length > 0) {
          const N = I[C].semver;
          if (N.major === O.major && N.minor === O.minor && N.patch === O.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Li;
}
var Ui, vs;
function ii() {
  if (vs) return Ui;
  vs = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(c, f) {
      if (f = r(f), c instanceof t) {
        if (c.loose === !!f.loose)
          return c;
        c = c.value;
      }
      c = c.trim().split(/\s+/).join(" "), a("comparator", c, f), this.options = f, this.loose = !!f.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(c) {
      const f = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], p = c.match(f);
      if (!p)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = p[1] !== void 0 ? p[1] : "", this.operator === "=" && (this.operator = ""), p[2] ? this.semver = new s(p[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(c) {
      if (a("Comparator.test", c, this.options.loose), this.semver === e || c === e)
        return !0;
      if (typeof c == "string")
        try {
          c = new s(c, this.options);
        } catch {
          return !1;
        }
      return o(c, this.operator, this.semver, this.options);
    }
    intersects(c, f) {
      if (!(c instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(c.value, f).test(this.value) : c.operator === "" ? c.value === "" ? !0 : new l(this.value, f).test(c.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || c.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || c.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && c.operator.startsWith(">") || this.operator.startsWith("<") && c.operator.startsWith("<") || this.semver.version === c.semver.version && this.operator.includes("=") && c.operator.includes("=") || o(this.semver, "<", c.semver, f) && this.operator.startsWith(">") && c.operator.startsWith("<") || o(this.semver, ">", c.semver, f) && this.operator.startsWith("<") && c.operator.startsWith(">")));
    }
  }
  Ui = t;
  const r = Ho, { safeRe: n, t: i } = Qr, o = yu, a = ri, s = Ne, l = Ve();
  return Ui;
}
const ky = Ve(), My = (e, t, r) => {
  try {
    t = new ky(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var oi = My;
const By = Ve(), jy = (e, t) => new By(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var Hy = jy;
const qy = Ne, Gy = Ve(), Wy = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new Gy(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === -1) && (n = a, i = new qy(n, r));
  }), n;
};
var Vy = Wy;
const Yy = Ne, zy = Ve(), Xy = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new zy(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === 1) && (n = a, i = new Yy(n, r));
  }), n;
};
var Ky = Xy;
const ki = Ne, Jy = Ve(), ws = ni, Qy = (e, t) => {
  e = new Jy(e, t);
  let r = new ki("0.0.0");
  if (e.test(r) || (r = new ki("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let o = null;
    i.forEach((a) => {
      const s = new ki(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || ws(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || ws(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var Zy = Qy;
const eE = Ve(), tE = (e, t) => {
  try {
    return new eE(e, t).range || "*";
  } catch {
    return null;
  }
};
var rE = tE;
const nE = Ne, Eu = ii(), { ANY: iE } = Eu, oE = Ve(), aE = oi, _s = ni, Ss = Go, sE = Vo, lE = Wo, cE = (e, t, r, n) => {
  e = new nE(e, n), t = new oE(t, n);
  let i, o, a, s, l;
  switch (r) {
    case ">":
      i = _s, o = sE, a = Ss, s = ">", l = ">=";
      break;
    case "<":
      i = Ss, o = lE, a = _s, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (aE(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const c = t.set[d];
    let f = null, p = null;
    if (c.forEach((g) => {
      g.semver === iE && (g = new Eu(">=0.0.0")), f = f || g, p = p || g, i(g.semver, f.semver, n) ? f = g : a(g.semver, p.semver, n) && (p = g);
    }), f.operator === s || f.operator === l || (!p.operator || p.operator === s) && o(e, p.semver))
      return !1;
    if (p.operator === l && a(e, p.semver))
      return !1;
  }
  return !0;
};
var Yo = cE;
const uE = Yo, fE = (e, t, r) => uE(e, t, ">", r);
var dE = fE;
const hE = Yo, pE = (e, t, r) => hE(e, t, "<", r);
var mE = pE;
const As = Ve(), gE = (e, t, r) => (e = new As(e, r), t = new As(t, r), e.intersects(t, r));
var yE = gE;
const EE = oi, vE = We;
var wE = (e, t, r) => {
  const n = [];
  let i = null, o = null;
  const a = e.sort((c, f) => vE(c, f, r));
  for (const c of a)
    EE(c, t, r) ? (o = c, i || (i = c)) : (o && n.push([i, o]), o = null, i = null);
  i && n.push([i, null]);
  const s = [];
  for (const [c, f] of n)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < d.length ? l : t;
};
const Ts = Ve(), zo = ii(), { ANY: Mi } = zo, vr = oi, Xo = We, _E = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Ts(e, r), t = new Ts(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = AE(i, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, SE = [new zo(">=0.0.0-0")], bs = [new zo(">=0.0.0")], AE = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Mi) {
    if (t.length === 1 && t[0].semver === Mi)
      return !0;
    r.includePrerelease ? e = SE : e = bs;
  }
  if (t.length === 1 && t[0].semver === Mi) {
    if (r.includePrerelease)
      return !0;
    t = bs;
  }
  const n = /* @__PURE__ */ new Set();
  let i, o;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? i = Cs(i, g, r) : g.operator === "<" || g.operator === "<=" ? o = Os(o, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = Xo(i.semver, o.semver, r), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (i && !vr(g, String(i), r) || o && !vr(g, String(o), r))
      return null;
    for (const _ of t)
      if (!vr(g, String(_), r))
        return !1;
    return !0;
  }
  let s, l, d, c, f = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, p = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const g of t) {
    if (c = c || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", i) {
      if (p && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === p.major && g.semver.minor === p.minor && g.semver.patch === p.patch && (p = !1), g.operator === ">" || g.operator === ">=") {
        if (s = Cs(i, g, r), s === g && s !== i)
          return !1;
      } else if (i.operator === ">=" && !vr(i.semver, String(g), r))
        return !1;
    }
    if (o) {
      if (f && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === f.major && g.semver.minor === f.minor && g.semver.patch === f.patch && (f = !1), g.operator === "<" || g.operator === "<=") {
        if (l = Os(o, g, r), l === g && l !== o)
          return !1;
      } else if (o.operator === "<=" && !vr(o.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && d && !o && a !== 0 || o && c && !i && a !== 0 || p || f);
}, Cs = (e, t, r) => {
  if (!e)
    return t;
  const n = Xo(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Os = (e, t, r) => {
  if (!e)
    return t;
  const n = Xo(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var TE = _E;
const Bi = Qr, Ps = ti, bE = Ne, Is = pu, CE = ur, OE = $g, PE = Lg, IE = kg, RE = Bg, DE = qg, NE = Vg, $E = Xg, FE = Qg, xE = We, LE = ry, UE = oy, kE = qo, ME = cy, BE = dy, jE = ni, HE = Go, qE = mu, GE = gu, WE = Wo, VE = Vo, YE = yu, zE = xy, XE = ii(), KE = Ve(), JE = oi, QE = Hy, ZE = Vy, ev = Ky, tv = Zy, rv = rE, nv = Yo, iv = dE, ov = mE, av = yE, sv = wE, lv = TE;
var vu = {
  parse: CE,
  valid: OE,
  clean: PE,
  inc: IE,
  diff: RE,
  major: DE,
  minor: NE,
  patch: $E,
  prerelease: FE,
  compare: xE,
  rcompare: LE,
  compareLoose: UE,
  compareBuild: kE,
  sort: ME,
  rsort: BE,
  gt: jE,
  lt: HE,
  eq: qE,
  neq: GE,
  gte: WE,
  lte: VE,
  cmp: YE,
  coerce: zE,
  Comparator: XE,
  Range: KE,
  satisfies: JE,
  toComparators: QE,
  maxSatisfying: ZE,
  minSatisfying: ev,
  minVersion: tv,
  validRange: rv,
  outside: nv,
  gtr: iv,
  ltr: ov,
  intersects: av,
  simplifyRange: sv,
  subset: lv,
  SemVer: bE,
  re: Bi.re,
  src: Bi.src,
  tokens: Bi.t,
  SEMVER_SPEC_VERSION: Ps.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Ps.RELEASE_TYPES,
  compareIdentifiers: Is.compareIdentifiers,
  rcompareIdentifiers: Is.rcompareIdentifiers
}, Zr = {}, Wn = { exports: {} };
Wn.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", d = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", p = "[object Error]", g = "[object Function]", _ = "[object GeneratorFunction]", E = "[object Map]", S = "[object Number]", A = "[object Null]", T = "[object Object]", $ = "[object Promise]", x = "[object Proxy]", te = "[object RegExp]", se = "[object Set]", V = "[object String]", Le = "[object Symbol]", y = "[object Undefined]", q = "[object WeakMap]", B = "[object ArrayBuffer]", M = "[object DataView]", z = "[object Float32Array]", I = "[object Float64Array]", O = "[object Int8Array]", D = "[object Int16Array]", C = "[object Int32Array]", N = "[object Uint8Array]", R = "[object Uint8ClampedArray]", k = "[object Uint16Array]", G = "[object Uint32Array]", j = /[\\^$.*+?()[\]{}|]/g, X = /^\[object .+?Constructor\]$/, he = /^(?:0|[1-9]\d*)$/, U = {};
  U[z] = U[I] = U[O] = U[D] = U[C] = U[N] = U[R] = U[k] = U[G] = !0, U[s] = U[l] = U[B] = U[c] = U[M] = U[f] = U[p] = U[g] = U[E] = U[S] = U[T] = U[te] = U[se] = U[V] = U[q] = !1;
  var Ye = typeof le == "object" && le && le.Object === Object && le, h = typeof self == "object" && self && self.Object === Object && self, u = Ye || h || Function("return this")(), b = t && !t.nodeType && t, w = b && !0 && e && !e.nodeType && e, Y = w && w.exports === b, Q = Y && Ye.process, oe = function() {
    try {
      return Q && Q.binding && Q.binding("util");
    } catch {
    }
  }(), ye = oe && oe.isTypedArray;
  function _e(m, v) {
    for (var P = -1, F = m == null ? 0 : m.length, Z = 0, H = []; ++P < F; ) {
      var ae = m[P];
      v(ae, P, m) && (H[Z++] = ae);
    }
    return H;
  }
  function ot(m, v) {
    for (var P = -1, F = v.length, Z = m.length; ++P < F; )
      m[Z + P] = v[P];
    return m;
  }
  function ue(m, v) {
    for (var P = -1, F = m == null ? 0 : m.length; ++P < F; )
      if (v(m[P], P, m))
        return !0;
    return !1;
  }
  function je(m, v) {
    for (var P = -1, F = Array(m); ++P < m; )
      F[P] = v(P);
    return F;
  }
  function mi(m) {
    return function(v) {
      return m(v);
    };
  }
  function nn(m, v) {
    return m.has(v);
  }
  function dr(m, v) {
    return m == null ? void 0 : m[v];
  }
  function on(m) {
    var v = -1, P = Array(m.size);
    return m.forEach(function(F, Z) {
      P[++v] = [Z, F];
    }), P;
  }
  function Fu(m, v) {
    return function(P) {
      return m(v(P));
    };
  }
  function xu(m) {
    var v = -1, P = Array(m.size);
    return m.forEach(function(F) {
      P[++v] = F;
    }), P;
  }
  var Lu = Array.prototype, Uu = Function.prototype, an = Object.prototype, gi = u["__core-js_shared__"], ea = Uu.toString, ze = an.hasOwnProperty, ta = function() {
    var m = /[^.]+$/.exec(gi && gi.keys && gi.keys.IE_PROTO || "");
    return m ? "Symbol(src)_1." + m : "";
  }(), ra = an.toString, ku = RegExp(
    "^" + ea.call(ze).replace(j, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), na = Y ? u.Buffer : void 0, sn = u.Symbol, ia = u.Uint8Array, oa = an.propertyIsEnumerable, Mu = Lu.splice, Tt = sn ? sn.toStringTag : void 0, aa = Object.getOwnPropertySymbols, Bu = na ? na.isBuffer : void 0, ju = Fu(Object.keys, Object), yi = jt(u, "DataView"), hr = jt(u, "Map"), Ei = jt(u, "Promise"), vi = jt(u, "Set"), wi = jt(u, "WeakMap"), pr = jt(Object, "create"), Hu = Ot(yi), qu = Ot(hr), Gu = Ot(Ei), Wu = Ot(vi), Vu = Ot(wi), sa = sn ? sn.prototype : void 0, _i = sa ? sa.valueOf : void 0;
  function bt(m) {
    var v = -1, P = m == null ? 0 : m.length;
    for (this.clear(); ++v < P; ) {
      var F = m[v];
      this.set(F[0], F[1]);
    }
  }
  function Yu() {
    this.__data__ = pr ? pr(null) : {}, this.size = 0;
  }
  function zu(m) {
    var v = this.has(m) && delete this.__data__[m];
    return this.size -= v ? 1 : 0, v;
  }
  function Xu(m) {
    var v = this.__data__;
    if (pr) {
      var P = v[m];
      return P === n ? void 0 : P;
    }
    return ze.call(v, m) ? v[m] : void 0;
  }
  function Ku(m) {
    var v = this.__data__;
    return pr ? v[m] !== void 0 : ze.call(v, m);
  }
  function Ju(m, v) {
    var P = this.__data__;
    return this.size += this.has(m) ? 0 : 1, P[m] = pr && v === void 0 ? n : v, this;
  }
  bt.prototype.clear = Yu, bt.prototype.delete = zu, bt.prototype.get = Xu, bt.prototype.has = Ku, bt.prototype.set = Ju;
  function Qe(m) {
    var v = -1, P = m == null ? 0 : m.length;
    for (this.clear(); ++v < P; ) {
      var F = m[v];
      this.set(F[0], F[1]);
    }
  }
  function Qu() {
    this.__data__ = [], this.size = 0;
  }
  function Zu(m) {
    var v = this.__data__, P = cn(v, m);
    if (P < 0)
      return !1;
    var F = v.length - 1;
    return P == F ? v.pop() : Mu.call(v, P, 1), --this.size, !0;
  }
  function ef(m) {
    var v = this.__data__, P = cn(v, m);
    return P < 0 ? void 0 : v[P][1];
  }
  function tf(m) {
    return cn(this.__data__, m) > -1;
  }
  function rf(m, v) {
    var P = this.__data__, F = cn(P, m);
    return F < 0 ? (++this.size, P.push([m, v])) : P[F][1] = v, this;
  }
  Qe.prototype.clear = Qu, Qe.prototype.delete = Zu, Qe.prototype.get = ef, Qe.prototype.has = tf, Qe.prototype.set = rf;
  function Ct(m) {
    var v = -1, P = m == null ? 0 : m.length;
    for (this.clear(); ++v < P; ) {
      var F = m[v];
      this.set(F[0], F[1]);
    }
  }
  function nf() {
    this.size = 0, this.__data__ = {
      hash: new bt(),
      map: new (hr || Qe)(),
      string: new bt()
    };
  }
  function of(m) {
    var v = un(this, m).delete(m);
    return this.size -= v ? 1 : 0, v;
  }
  function af(m) {
    return un(this, m).get(m);
  }
  function sf(m) {
    return un(this, m).has(m);
  }
  function lf(m, v) {
    var P = un(this, m), F = P.size;
    return P.set(m, v), this.size += P.size == F ? 0 : 1, this;
  }
  Ct.prototype.clear = nf, Ct.prototype.delete = of, Ct.prototype.get = af, Ct.prototype.has = sf, Ct.prototype.set = lf;
  function ln(m) {
    var v = -1, P = m == null ? 0 : m.length;
    for (this.__data__ = new Ct(); ++v < P; )
      this.add(m[v]);
  }
  function cf(m) {
    return this.__data__.set(m, n), this;
  }
  function uf(m) {
    return this.__data__.has(m);
  }
  ln.prototype.add = ln.prototype.push = cf, ln.prototype.has = uf;
  function at(m) {
    var v = this.__data__ = new Qe(m);
    this.size = v.size;
  }
  function ff() {
    this.__data__ = new Qe(), this.size = 0;
  }
  function df(m) {
    var v = this.__data__, P = v.delete(m);
    return this.size = v.size, P;
  }
  function hf(m) {
    return this.__data__.get(m);
  }
  function pf(m) {
    return this.__data__.has(m);
  }
  function mf(m, v) {
    var P = this.__data__;
    if (P instanceof Qe) {
      var F = P.__data__;
      if (!hr || F.length < r - 1)
        return F.push([m, v]), this.size = ++P.size, this;
      P = this.__data__ = new Ct(F);
    }
    return P.set(m, v), this.size = P.size, this;
  }
  at.prototype.clear = ff, at.prototype.delete = df, at.prototype.get = hf, at.prototype.has = pf, at.prototype.set = mf;
  function gf(m, v) {
    var P = fn(m), F = !P && Df(m), Z = !P && !F && Si(m), H = !P && !F && !Z && ga(m), ae = P || F || Z || H, pe = ae ? je(m.length, String) : [], Ee = pe.length;
    for (var re in m)
      ze.call(m, re) && !(ae && // Safari 9 has enumerable `arguments.length` in strict mode.
      (re == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      Z && (re == "offset" || re == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      H && (re == "buffer" || re == "byteLength" || re == "byteOffset") || // Skip index properties.
      Cf(re, Ee))) && pe.push(re);
    return pe;
  }
  function cn(m, v) {
    for (var P = m.length; P--; )
      if (da(m[P][0], v))
        return P;
    return -1;
  }
  function yf(m, v, P) {
    var F = v(m);
    return fn(m) ? F : ot(F, P(m));
  }
  function mr(m) {
    return m == null ? m === void 0 ? y : A : Tt && Tt in Object(m) ? Tf(m) : Rf(m);
  }
  function la(m) {
    return gr(m) && mr(m) == s;
  }
  function ca(m, v, P, F, Z) {
    return m === v ? !0 : m == null || v == null || !gr(m) && !gr(v) ? m !== m && v !== v : Ef(m, v, P, F, ca, Z);
  }
  function Ef(m, v, P, F, Z, H) {
    var ae = fn(m), pe = fn(v), Ee = ae ? l : st(m), re = pe ? l : st(v);
    Ee = Ee == s ? T : Ee, re = re == s ? T : re;
    var Ue = Ee == T, He = re == T, Se = Ee == re;
    if (Se && Si(m)) {
      if (!Si(v))
        return !1;
      ae = !0, Ue = !1;
    }
    if (Se && !Ue)
      return H || (H = new at()), ae || ga(m) ? ua(m, v, P, F, Z, H) : Sf(m, v, Ee, P, F, Z, H);
    if (!(P & i)) {
      var ke = Ue && ze.call(m, "__wrapped__"), Me = He && ze.call(v, "__wrapped__");
      if (ke || Me) {
        var lt = ke ? m.value() : m, Ze = Me ? v.value() : v;
        return H || (H = new at()), Z(lt, Ze, P, F, H);
      }
    }
    return Se ? (H || (H = new at()), Af(m, v, P, F, Z, H)) : !1;
  }
  function vf(m) {
    if (!ma(m) || Pf(m))
      return !1;
    var v = ha(m) ? ku : X;
    return v.test(Ot(m));
  }
  function wf(m) {
    return gr(m) && pa(m.length) && !!U[mr(m)];
  }
  function _f(m) {
    if (!If(m))
      return ju(m);
    var v = [];
    for (var P in Object(m))
      ze.call(m, P) && P != "constructor" && v.push(P);
    return v;
  }
  function ua(m, v, P, F, Z, H) {
    var ae = P & i, pe = m.length, Ee = v.length;
    if (pe != Ee && !(ae && Ee > pe))
      return !1;
    var re = H.get(m);
    if (re && H.get(v))
      return re == v;
    var Ue = -1, He = !0, Se = P & o ? new ln() : void 0;
    for (H.set(m, v), H.set(v, m); ++Ue < pe; ) {
      var ke = m[Ue], Me = v[Ue];
      if (F)
        var lt = ae ? F(Me, ke, Ue, v, m, H) : F(ke, Me, Ue, m, v, H);
      if (lt !== void 0) {
        if (lt)
          continue;
        He = !1;
        break;
      }
      if (Se) {
        if (!ue(v, function(Ze, Pt) {
          if (!nn(Se, Pt) && (ke === Ze || Z(ke, Ze, P, F, H)))
            return Se.push(Pt);
        })) {
          He = !1;
          break;
        }
      } else if (!(ke === Me || Z(ke, Me, P, F, H))) {
        He = !1;
        break;
      }
    }
    return H.delete(m), H.delete(v), He;
  }
  function Sf(m, v, P, F, Z, H, ae) {
    switch (P) {
      case M:
        if (m.byteLength != v.byteLength || m.byteOffset != v.byteOffset)
          return !1;
        m = m.buffer, v = v.buffer;
      case B:
        return !(m.byteLength != v.byteLength || !H(new ia(m), new ia(v)));
      case c:
      case f:
      case S:
        return da(+m, +v);
      case p:
        return m.name == v.name && m.message == v.message;
      case te:
      case V:
        return m == v + "";
      case E:
        var pe = on;
      case se:
        var Ee = F & i;
        if (pe || (pe = xu), m.size != v.size && !Ee)
          return !1;
        var re = ae.get(m);
        if (re)
          return re == v;
        F |= o, ae.set(m, v);
        var Ue = ua(pe(m), pe(v), F, Z, H, ae);
        return ae.delete(m), Ue;
      case Le:
        if (_i)
          return _i.call(m) == _i.call(v);
    }
    return !1;
  }
  function Af(m, v, P, F, Z, H) {
    var ae = P & i, pe = fa(m), Ee = pe.length, re = fa(v), Ue = re.length;
    if (Ee != Ue && !ae)
      return !1;
    for (var He = Ee; He--; ) {
      var Se = pe[He];
      if (!(ae ? Se in v : ze.call(v, Se)))
        return !1;
    }
    var ke = H.get(m);
    if (ke && H.get(v))
      return ke == v;
    var Me = !0;
    H.set(m, v), H.set(v, m);
    for (var lt = ae; ++He < Ee; ) {
      Se = pe[He];
      var Ze = m[Se], Pt = v[Se];
      if (F)
        var ya = ae ? F(Pt, Ze, Se, v, m, H) : F(Ze, Pt, Se, m, v, H);
      if (!(ya === void 0 ? Ze === Pt || Z(Ze, Pt, P, F, H) : ya)) {
        Me = !1;
        break;
      }
      lt || (lt = Se == "constructor");
    }
    if (Me && !lt) {
      var dn = m.constructor, hn = v.constructor;
      dn != hn && "constructor" in m && "constructor" in v && !(typeof dn == "function" && dn instanceof dn && typeof hn == "function" && hn instanceof hn) && (Me = !1);
    }
    return H.delete(m), H.delete(v), Me;
  }
  function fa(m) {
    return yf(m, Ff, bf);
  }
  function un(m, v) {
    var P = m.__data__;
    return Of(v) ? P[typeof v == "string" ? "string" : "hash"] : P.map;
  }
  function jt(m, v) {
    var P = dr(m, v);
    return vf(P) ? P : void 0;
  }
  function Tf(m) {
    var v = ze.call(m, Tt), P = m[Tt];
    try {
      m[Tt] = void 0;
      var F = !0;
    } catch {
    }
    var Z = ra.call(m);
    return F && (v ? m[Tt] = P : delete m[Tt]), Z;
  }
  var bf = aa ? function(m) {
    return m == null ? [] : (m = Object(m), _e(aa(m), function(v) {
      return oa.call(m, v);
    }));
  } : xf, st = mr;
  (yi && st(new yi(new ArrayBuffer(1))) != M || hr && st(new hr()) != E || Ei && st(Ei.resolve()) != $ || vi && st(new vi()) != se || wi && st(new wi()) != q) && (st = function(m) {
    var v = mr(m), P = v == T ? m.constructor : void 0, F = P ? Ot(P) : "";
    if (F)
      switch (F) {
        case Hu:
          return M;
        case qu:
          return E;
        case Gu:
          return $;
        case Wu:
          return se;
        case Vu:
          return q;
      }
    return v;
  });
  function Cf(m, v) {
    return v = v ?? a, !!v && (typeof m == "number" || he.test(m)) && m > -1 && m % 1 == 0 && m < v;
  }
  function Of(m) {
    var v = typeof m;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? m !== "__proto__" : m === null;
  }
  function Pf(m) {
    return !!ta && ta in m;
  }
  function If(m) {
    var v = m && m.constructor, P = typeof v == "function" && v.prototype || an;
    return m === P;
  }
  function Rf(m) {
    return ra.call(m);
  }
  function Ot(m) {
    if (m != null) {
      try {
        return ea.call(m);
      } catch {
      }
      try {
        return m + "";
      } catch {
      }
    }
    return "";
  }
  function da(m, v) {
    return m === v || m !== m && v !== v;
  }
  var Df = la(/* @__PURE__ */ function() {
    return arguments;
  }()) ? la : function(m) {
    return gr(m) && ze.call(m, "callee") && !oa.call(m, "callee");
  }, fn = Array.isArray;
  function Nf(m) {
    return m != null && pa(m.length) && !ha(m);
  }
  var Si = Bu || Lf;
  function $f(m, v) {
    return ca(m, v);
  }
  function ha(m) {
    if (!ma(m))
      return !1;
    var v = mr(m);
    return v == g || v == _ || v == d || v == x;
  }
  function pa(m) {
    return typeof m == "number" && m > -1 && m % 1 == 0 && m <= a;
  }
  function ma(m) {
    var v = typeof m;
    return m != null && (v == "object" || v == "function");
  }
  function gr(m) {
    return m != null && typeof m == "object";
  }
  var ga = ye ? mi(ye) : wf;
  function Ff(m) {
    return Nf(m) ? gf(m) : _f(m);
  }
  function xf() {
    return [];
  }
  function Lf() {
    return !1;
  }
  e.exports = $f;
})(Wn, Wn.exports);
var cv = Wn.exports;
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.DownloadedUpdateHelper = void 0;
Zr.createTempUpdateFile = pv;
const uv = Wr, fv = nt, Rs = cv, Rt = St, Pr = ie;
class dv {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Pr.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Rs(this.versionInfo, r) && Rs(this.fileInfo.info, n.info) && await (0, Rt.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(n, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, r, n, i, o, a) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, Rt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Rt.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, r) {
    const n = this.getUpdateInfoFile();
    if (!await (0, Rt.pathExists)(n))
      return null;
    let o;
    try {
      o = await (0, Rt.readJson)(n);
    } catch (d) {
      let c = "No cached update info available";
      return d.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${d.message})`), r.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = Pr.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Rt.pathExists)(s))
      return r.info("Cached update file doesn't exist"), null;
    const l = await hv(s);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return Pr.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
Zr.DownloadedUpdateHelper = dv;
function hv(e, t = "sha512", r = "base64", n) {
  return new Promise((i, o) => {
    const a = (0, uv.createHash)(t);
    a.on("error", o).setEncoding(r), (0, fv.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function pv(e, t, r) {
  let n = 0, i = Pr.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Rt.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${a}`), i = Pr.join(t, `${n++}-${e}`);
    }
  return i;
}
var ai = {}, Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
Ko.getAppCacheDir = gv;
const ji = ie, mv = Vr;
function gv() {
  const e = (0, mv.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || ji.join(e, "AppData", "Local") : process.platform === "darwin" ? t = ji.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || ji.join(e, ".cache"), t;
}
Object.defineProperty(ai, "__esModule", { value: !0 });
ai.ElectronAppAdapter = void 0;
const Ds = ie, yv = Ko;
class Ev {
  constructor(t = Lt.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? Ds.join(process.resourcesPath, "app-update.yml") : Ds.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, yv.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (r, n) => t(n));
  }
}
ai.ElectronAppAdapter = Ev;
var wu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = ge;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return Lt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, a, s) {
      return await s.cancellationToken.createPromise((l, d, c) => {
        const f = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: a,
          options: s,
          onCancel: c,
          callback: (p) => {
            p == null ? l(a) : d(p);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, a) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const s = Lt.net.request({
        ...o,
        session: this.cachedSession
      });
      return s.on("response", a), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
    }
    addRedirectHandlers(o, a, s, l, d) {
      o.on("redirect", (c, f, p) => {
        o.abort(), l > this.maxRedirects ? s(this.createMaxRedirectError()) : d(t.HttpExecutor.prepareRedirectUrlOptions(p, a));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(wu);
var en = {}, Be = {}, vv = "[object Symbol]", _u = /[\\^$.*+?()[\]{}|]/g, wv = RegExp(_u.source), _v = typeof le == "object" && le && le.Object === Object && le, Sv = typeof self == "object" && self && self.Object === Object && self, Av = _v || Sv || Function("return this")(), Tv = Object.prototype, bv = Tv.toString, Ns = Av.Symbol, $s = Ns ? Ns.prototype : void 0, Fs = $s ? $s.toString : void 0;
function Cv(e) {
  if (typeof e == "string")
    return e;
  if (Pv(e))
    return Fs ? Fs.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function Ov(e) {
  return !!e && typeof e == "object";
}
function Pv(e) {
  return typeof e == "symbol" || Ov(e) && bv.call(e) == vv;
}
function Iv(e) {
  return e == null ? "" : Cv(e);
}
function Rv(e) {
  return e = Iv(e), e && wv.test(e) ? e.replace(_u, "\\$&") : e;
}
var Dv = Rv;
Object.defineProperty(Be, "__esModule", { value: !0 });
Be.newBaseUrl = $v;
Be.newUrlFromBase = po;
Be.getChannelFilename = Fv;
Be.blockmapFiles = xv;
const Su = sr, Nv = Dv;
function $v(e) {
  const t = new Su.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function po(e, t, r = !1) {
  const n = new Su.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function Fv(e) {
  return `${e}.yml`;
}
function xv(e, t, r) {
  const n = po(`${e.pathname}.blockmap`, e);
  return [po(`${e.pathname.replace(new RegExp(Nv(r), "g"), t)}.blockmap`, e), n];
}
var de = {};
Object.defineProperty(de, "__esModule", { value: !0 });
de.Provider = void 0;
de.findFile = kv;
de.parseUpdateInfo = Mv;
de.getFileList = Au;
de.resolveFiles = Bv;
const wt = ge, Lv = we, xs = Be;
class Uv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, r, n) {
    return this.executor.request(this.createRequestOptions(t, r), n);
  }
  createRequestOptions(t, r) {
    const n = {};
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, wt.configureRequestUrl)(t, n), n;
  }
}
de.Provider = Uv;
function kv(e, t, r) {
  if (e.length === 0)
    throw (0, wt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const n = e.find((i) => i.url.pathname.toLowerCase().endsWith(`.${t}`));
  return n ?? (r == null ? e[0] : e.find((i) => !r.some((o) => i.url.pathname.toLowerCase().endsWith(`.${o}`))));
}
function Mv(e, t, r) {
  if (e == null)
    throw (0, wt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, Lv.load)(e);
  } catch (i) {
    throw (0, wt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function Au(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, wt.newError)(`No files provided: ${(0, wt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function Bv(e, t, r = (n) => n) {
  const i = Au(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, wt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, wt.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, xs.newUrlFromBase)(r(s.url), t),
      info: s
    };
  }), o = e.packages, a = o == null ? null : o[process.arch] || o.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, xs.newUrlFromBase)(r(a.path), t).href
  }), i;
}
Object.defineProperty(en, "__esModule", { value: !0 });
en.GenericProvider = void 0;
const Ls = ge, Hi = Be, qi = de;
class jv extends qi.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, Hi.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Hi.getChannelFilename)(this.channel), r = (0, Hi.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, qi.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof Ls.HttpError && i.statusCode === 404)
          throw (0, Ls.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((o, a) => {
            try {
              setTimeout(o, 1e3 * n);
            } catch (s) {
              a(s);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, qi.resolveFiles)(t, this.baseUrl);
  }
}
en.GenericProvider = jv;
var si = {}, li = {};
Object.defineProperty(li, "__esModule", { value: !0 });
li.BitbucketProvider = void 0;
const Us = ge, Gi = Be, Wi = de;
class Hv extends Wi.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, Gi.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Us.CancellationToken(), r = (0, Gi.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Gi.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, Wi.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Us.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Wi.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
li.BitbucketProvider = Hv;
var _t = {};
Object.defineProperty(_t, "__esModule", { value: !0 });
_t.GitHubProvider = _t.BaseGitHubProvider = void 0;
_t.computeReleaseNotes = bu;
const et = ge, Jt = vu, qv = sr, Qt = Be, mo = de, Vi = /\/tag\/([^/]+)$/;
class Tu extends mo.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, Qt.newBaseUrl)((0, et.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, Qt.newBaseUrl)((0, et.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
_t.BaseGitHubProvider = Tu;
class Gv extends Tu {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, o;
    const a = new et.CancellationToken(), s = await this.httpRequest((0, Qt.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), l = (0, et.parseXml)(s);
    let d = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const S = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = Jt.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (S === null)
          c = Vi.exec(d.element("link").attribute("href"))[1];
        else
          for (const A of l.getElements("entry")) {
            const T = Vi.exec(A.element("link").attribute("href"));
            if (T === null)
              continue;
            const $ = T[1], x = ((n = Jt.prerelease($)) === null || n === void 0 ? void 0 : n[0]) || null, te = !S || ["alpha", "beta"].includes(S), se = x !== null && !["alpha", "beta"].includes(String(x));
            if (te && !se && !(S === "beta" && x === "alpha")) {
              c = $;
              break;
            }
            if (x && x === S) {
              c = $;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(a);
        for (const S of l.getElements("entry"))
          if (Vi.exec(S.element("link").attribute("href"))[1] === c) {
            d = S;
            break;
          }
      }
    } catch (S) {
      throw (0, et.newError)(`Cannot parse releases feed: ${S.stack || S.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, et.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, p = "", g = "";
    const _ = async (S) => {
      p = (0, Qt.getChannelFilename)(S), g = (0, Qt.newUrlFromBase)(this.getBaseDownloadPath(String(c), p), this.baseUrl);
      const A = this.createRequestOptions(g);
      try {
        return await this.executor.request(A, a);
      } catch (T) {
        throw T instanceof et.HttpError && T.statusCode === 404 ? (0, et.newError)(`Cannot find ${p} in the latest release artifacts (${g}): ${T.stack || T.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : T;
      }
    };
    try {
      let S = this.channel;
      this.updater.allowPrerelease && (!((i = Jt.prerelease(c)) === null || i === void 0) && i[0]) && (S = this.getCustomChannelName(String((o = Jt.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), f = await _(S);
    } catch (S) {
      if (this.updater.allowPrerelease)
        f = await _(this.getDefaultChannelName());
      else
        throw S;
    }
    const E = (0, mo.parseUpdateInfo)(f, p, g);
    return E.releaseName == null && (E.releaseName = d.elementValueOrEmpty("title")), E.releaseNotes == null && (E.releaseNotes = bu(this.updater.currentVersion, this.updater.fullChangelog, l, d)), {
      tag: c,
      ...E
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, Qt.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new qv.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, et.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, mo.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
_t.GitHubProvider = Gv;
function ks(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function bu(e, t, r, n) {
  if (!t)
    return ks(n);
  const i = [];
  for (const o of r.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Jt.lt(e, a) && i.push({
      version: a,
      note: ks(o)
    });
  }
  return i.sort((o, a) => Jt.rcompare(o.version, a.version));
}
var ci = {};
Object.defineProperty(ci, "__esModule", { value: !0 });
ci.KeygenProvider = void 0;
const Ms = ge, Yi = Be, zi = de;
class Wv extends zi.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Yi.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Ms.CancellationToken(), r = (0, Yi.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Yi.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, zi.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, Ms.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, zi.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
ci.KeygenProvider = Wv;
var ui = {};
Object.defineProperty(ui, "__esModule", { value: !0 });
ui.PrivateGitHubProvider = void 0;
const Gt = ge, Vv = we, Yv = ie, Bs = sr, js = Be, zv = _t, Xv = de;
class Kv extends zv.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new Gt.CancellationToken(), r = (0, js.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((s) => s.name === r);
    if (i == null)
      throw (0, Gt.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new Bs.URL(i.url);
    let a;
    try {
      a = (0, Vv.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof Gt.HttpError && s.statusCode === 404 ? (0, Gt.newError)(`Cannot find ${r} in the latest release artifacts (${o}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
    }
    return a.assets = n.assets, a;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const r = this.updater.allowPrerelease;
    let n = this.basePath;
    r || (n = `${n}/latest`);
    const i = (0, js.newUrlFromBase)(n, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? o.find((a) => a.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, Gt.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, Xv.getFileList)(t).map((r) => {
      const n = Yv.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === n);
      if (i == null)
        throw (0, Gt.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Bs.URL(i.url),
        info: r
      };
    });
  }
}
ui.PrivateGitHubProvider = Kv;
Object.defineProperty(si, "__esModule", { value: !0 });
si.isUrlProbablySupportMultiRangeRequests = Cu;
si.createClient = tw;
const Cn = ge, Jv = li, Hs = en, Qv = _t, Zv = ci, ew = ui;
function Cu(e) {
  return !e.includes("s3.amazonaws.com");
}
function tw(e, t, r) {
  if (typeof e == "string")
    throw (0, Cn.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Qv.GitHubProvider(i, t, r) : new ew.PrivateGitHubProvider(i, t, o, r);
    }
    case "bitbucket":
      return new Jv.BitbucketProvider(e, t, r);
    case "keygen":
      return new Zv.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new Hs.GenericProvider({
        provider: "generic",
        url: (0, Cn.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Hs.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Cu(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, Cn.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, r);
    }
    default:
      throw (0, Cn.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var fi = {}, tn = {}, fr = {}, Bt = {};
Object.defineProperty(Bt, "__esModule", { value: !0 });
Bt.OperationKind = void 0;
Bt.computeOperations = rw;
var $t;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})($t || (Bt.OperationKind = $t = {}));
function rw(e, t, r) {
  const n = Gs(e.files), i = Gs(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, d = n.get(l);
  if (d == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: p, checksumToOldSize: g } = iw(n.get(l), d.offset, r);
  let _ = a.offset;
  for (let E = 0; E < c.checksums.length; _ += c.sizes[E], E++) {
    const S = c.sizes[E], A = c.checksums[E];
    let T = p.get(A);
    T != null && g.get(A) !== S && (r.warn(`Checksum ("${A}") matches, but size differs (old: ${g.get(A)}, new: ${S})`), T = void 0), T === void 0 ? (f++, o != null && o.kind === $t.DOWNLOAD && o.end === _ ? o.end += S : (o = {
      kind: $t.DOWNLOAD,
      start: _,
      end: _ + S
      // oldBlocks: null,
    }, qs(o, s, A, E))) : o != null && o.kind === $t.COPY && o.end === T ? o.end += S : (o = {
      kind: $t.COPY,
      start: T,
      end: T + S
      // oldBlocks: [checksum]
    }, qs(o, s, A, E));
  }
  return f > 0 && r.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const nw = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function qs(e, t, r, n) {
  if (nw && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((a, s) => a < s ? a : s);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${$t[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function iw(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const s = e.checksums[a], l = e.sizes[a], d = i.get(s);
    if (d === void 0)
      n.set(s, o), i.set(s, l);
    else if (r.debug != null) {
      const c = d === l ? "(same size)" : `(size: ${d}, this size: ${l})`;
      r.debug(`${s} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function Gs(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(fr, "__esModule", { value: !0 });
fr.DataSplitter = void 0;
fr.copyData = Ou;
const On = ge, ow = nt, aw = ar, sw = Bt, Ws = Buffer.from(`\r
\r
`);
var dt;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(dt || (dt = {}));
function Ou(e, t, r, n, i) {
  const o = (0, ow.createReadStream)("", {
    fd: r,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", n), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class lw extends aw.Writable {
  constructor(t, r, n, i, o, a) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = o, this.finishHandler = a, this.partIndex = -1, this.headerListBuffer = null, this.readState = dt.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, r, n) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(n).catch(n);
  }
  async handleData(t) {
    let r = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, On.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === dt.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = dt.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === dt.BODY)
          this.readState = dt.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, On.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < a)
            await this.copyExistingData(s, a);
          else if (s > a)
            throw (0, On.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = dt.HEADER;
            return;
          }
        }
        const n = this.partIndexToLength[this.partIndex], i = r + n, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, r, o), this.remainingPartDataCount = n - (o - r), this.remainingPartDataCount > 0)
          return;
        if (r = i + this.boundaryLength, r >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, r) {
    return new Promise((n, i) => {
      const o = () => {
        if (t === r) {
          n();
          return;
        }
        const a = this.options.tasks[t];
        if (a.kind !== sw.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Ou(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(Ws, r);
    if (n !== -1)
      return n + Ws.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, On.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((o, a) => {
      i.on("error", a), i.once("drain", () => {
        i.removeListener("error", a), o();
      });
    });
  }
}
fr.DataSplitter = lw;
var di = {};
Object.defineProperty(di, "__esModule", { value: !0 });
di.executeTasksUsingMultipleRangeRequests = cw;
di.checkIsRangesSupported = yo;
const go = ge, Vs = fr, Ys = Bt;
function cw(e, t, r, n, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const s = a + 1e3;
    uw(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: n
    }, r, () => o(s), i);
  };
  return o;
}
function uw(e, t, r, n, i) {
  let o = "bytes=", a = 0;
  const s = /* @__PURE__ */ new Map(), l = [];
  for (let f = t.start; f < t.end; f++) {
    const p = t.tasks[f];
    p.kind === Ys.OperationKind.DOWNLOAD && (o += `${p.start}-${p.end - 1}, `, s.set(a, f), a++, l.push(p.end - p.start));
  }
  if (a <= 1) {
    const f = (p) => {
      if (p >= t.end) {
        n();
        return;
      }
      const g = t.tasks[p++];
      if (g.kind === Ys.OperationKind.COPY)
        (0, Vs.copyData)(g, r, t.oldFileFd, i, () => f(p));
      else {
        const _ = e.createRequestOptions();
        _.headers.Range = `bytes=${g.start}-${g.end - 1}`;
        const E = e.httpExecutor.createRequest(_, (S) => {
          yo(S, i) && (S.pipe(r, {
            end: !1
          }), S.once("end", () => f(p)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(E, i), E.end();
      }
    };
    f(t.start);
    return;
  }
  const d = e.createRequestOptions();
  d.headers.Range = o.substring(0, o.length - 2);
  const c = e.httpExecutor.createRequest(d, (f) => {
    if (!yo(f, i))
      return;
    const p = (0, go.safeGetHeader)(f, "content-type"), g = /^multipart\/.+?(?:; boundary=(?:(?:"(.+)")|(?:([^\s]+))))$/i.exec(p);
    if (g == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${p}"`));
      return;
    }
    const _ = new Vs.DataSplitter(r, t, s, g[1] || g[2], l, n);
    _.on("error", i), f.pipe(_), f.on("end", () => {
      setTimeout(() => {
        c.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(c, i), c.end();
}
function yo(e, t) {
  if (e.statusCode >= 400)
    return t((0, go.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, go.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var hi = {};
Object.defineProperty(hi, "__esModule", { value: !0 });
hi.ProgressDifferentialDownloadCallbackTransform = void 0;
const fw = ar;
var Zt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Zt || (Zt = {}));
class dw extends fw.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = Zt.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == Zt.COPY) {
      n(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  beginFileCopy() {
    this.operationType = Zt.COPY;
  }
  beginRangeDownload() {
    this.operationType = Zt.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
hi.ProgressDifferentialDownloadCallbackTransform = dw;
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.DifferentialDownloader = void 0;
const wr = ge, Xi = St, hw = nt, pw = fr, mw = sr, Pn = Bt, zs = di, gw = hi;
class yw {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, r, n) {
    this.blockAwareFileInfo = t, this.httpExecutor = r, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, wr.configureRequestUrl)(this.options.newUrl, t), (0, wr.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, Pn.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let o = 0, a = 0;
    for (const l of i) {
      const d = l.end - l.start;
      l.kind === Pn.OperationKind.DOWNLOAD ? o += d : a += d;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return n.info(`Full: ${Xs(s)}, To download: ${Xs(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, Xi.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (a) {
        try {
          console.error(a);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, r) {
    const n = await (0, Xi.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, Xi.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const o = (0, hw.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let d;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const A = [];
        let T = 0;
        for (const x of t)
          x.kind === Pn.OperationKind.DOWNLOAD && (A.push(x.end - x.start), T += x.end - x.start);
        const $ = {
          expectedByteCounts: A,
          grandTotal: T
        };
        d = new gw.ProgressDifferentialDownloadCallbackTransform($, this.options.cancellationToken, this.options.onProgress), l.push(d);
      }
      const c = new wr.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), o.on("finish", () => {
        o.close(() => {
          r.splice(1, 1);
          try {
            c.validate();
          } catch (A) {
            s(A);
            return;
          }
          a(void 0);
        });
      }), l.push(o);
      let f = null;
      for (const A of l)
        A.on("error", s), f == null ? f = A : f = f.pipe(A);
      const p = l[0];
      let g;
      if (this.options.isUseMultipleRangeRequest) {
        g = (0, zs.executeTasksUsingMultipleRangeRequests)(this, t, p, n, s), g(0);
        return;
      }
      let _ = 0, E = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const S = this.createRequestOptions();
      S.redirect = "manual", g = (A) => {
        var T, $;
        if (A >= t.length) {
          this.fileMetadataBuffer != null && p.write(this.fileMetadataBuffer), p.end();
          return;
        }
        const x = t[A++];
        if (x.kind === Pn.OperationKind.COPY) {
          d && d.beginFileCopy(), (0, pw.copyData)(x, p, n, s, () => g(A));
          return;
        }
        const te = `bytes=${x.start}-${x.end - 1}`;
        S.headers.range = te, ($ = (T = this.logger) === null || T === void 0 ? void 0 : T.debug) === null || $ === void 0 || $.call(T, `download range: ${te}`), d && d.beginRangeDownload();
        const se = this.httpExecutor.createRequest(S, (V) => {
          V.on("error", s), V.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), V.statusCode >= 400 && s((0, wr.createHttpError)(V)), V.pipe(p, {
            end: !1
          }), V.once("end", () => {
            d && d.endRangeDownload(), ++_ === 100 ? (_ = 0, setTimeout(() => g(A), 1e3)) : g(A);
          });
        });
        se.on("redirect", (V, Le, y) => {
          this.logger.info(`Redirect to ${Ew(y)}`), E = y, (0, wr.configureRequestUrl)(new mw.URL(E), S), se.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(se, s), se.end();
      }, g(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let o = 0;
    if (await this.request(i, (a) => {
      a.copy(n, o), o += a.length;
    }), o !== n.length)
      throw new Error(`Received data length ${o} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const o = this.httpExecutor.createRequest(t, (a) => {
        (0, zs.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", r), a.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
tn.DifferentialDownloader = yw;
function Xs(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function Ew(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(fi, "__esModule", { value: !0 });
fi.GenericDifferentialDownloader = void 0;
const vw = tn;
class ww extends vw.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
fi.GenericDifferentialDownloader = ww;
var At = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = ge;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class r {
    constructor(o) {
      this.emitter = o;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(o) {
      n(this.emitter, "login", o);
    }
    progress(o) {
      n(this.emitter, e.DOWNLOAD_PROGRESS, o);
    }
    updateDownloaded(o) {
      n(this.emitter, e.UPDATE_DOWNLOADED, o);
    }
    updateCancelled(o) {
      n(this.emitter, "update-cancelled", o);
    }
  }
  e.UpdaterSignal = r;
  function n(i, o, a) {
    i.on(o, a);
  }
})(At);
Object.defineProperty(yt, "__esModule", { value: !0 });
yt.NoOpLogger = yt.AppUpdater = void 0;
const Ce = ge, _w = Wr, Sw = Vr, Aw = _o, Wt = St, Tw = we, Ki = ei, It = ie, Dt = vu, Ks = Zr, bw = ai, Js = wu, Cw = en, Ji = si, Ow = Sl, Pw = Be, Iw = fi, Vt = At;
class Jo extends Aw.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, Ce.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Ce.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, Js.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Pu();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Ki.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  constructor(t, r) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Vt.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this.clientPromise = null, this.stagingUserIdPromise = new Ki.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Ki.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), r == null ? (this.app = new bw.ElectronAppAdapter(), this.httpExecutor = new Js.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Dt.parse)(n);
    if (i == null)
      throw (0, Ce.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = Rw(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const r = this.createProviderRuntimeOptions();
    let n;
    typeof t == "string" ? n = new Cw.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, Ji.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, Ji.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const r = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((n) => (r(), n)).catch((n) => {
      throw r(), this.emit("error", n, `Cannot check for updates: ${(n.stack || n).toString()}`), n;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((r) => r != null && r.downloadPromise ? (r.downloadPromise.then(() => {
      const n = Jo.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new Lt.Notification(n).show();
    }), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
  }
  static formatDownloadNotification(t, r, n) {
    return n == null && (n = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), n = {
      title: n.title.replace("{appName}", r).replace("{version}", t),
      body: n.body.replace("{appName}", r).replace("{version}", t)
    }, n;
  }
  async isStagingMatch(t) {
    const r = t.stagingPercentage;
    let n = r;
    if (n == null)
      return !0;
    if (n = parseInt(n, 10), isNaN(n))
      return this._logger.warn(`Staging percentage is NaN: ${r}`), !0;
    n = n / 100;
    const i = await this.stagingUserIdPromise.value, a = Ce.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${a}, user id: ${i}`), a < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, Dt.parse)(t.version);
    if (r == null)
      throw (0, Ce.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, Dt.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await this.isStagingMatch(t))
      return !1;
    const o = (0, Dt.gt)(r, n), a = (0, Dt.lt)(r, n);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, Sw.release)();
    if (r)
      try {
        if ((0, Dt.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, Ji.createClient)(n, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, r = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": r })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), r = t.info;
    if (!await this.isUpdateAvailable(r))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${r.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", r), {
        isUpdateAvailable: !1,
        versionInfo: r,
        updateInfo: r
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(r);
    const n = new Ce.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Ce.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Ce.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Ce.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof Ce.CancellationError))
        try {
          this.dispatchError(i);
        } catch (o) {
          this._logger.warn(`Cannot dispatch error event: ${o.stack || o}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: r,
      requestHeaders: this.computeRequestHeaders(r.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw n(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(Vt.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, Tw.load)(await (0, Wt.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const r = t.fileExtraDownloadHeaders;
    if (r != null) {
      const n = this.requestHeaders;
      return n == null ? r : {
        ...r,
        ...n
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = It.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, Wt.readFile)(t, "utf-8");
      if (Ce.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = Ce.UUID.v5((0, _w.randomBytes)(4096), Ce.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, Wt.outputFile)(t, r);
    } catch (n) {
      this._logger.warn(`Couldn't write out staging user ID: ${n}`);
    }
    return r;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const r of Object.keys(t)) {
      const n = r.toLowerCase();
      if (n === "authorization" || n === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const r = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
      r == null && n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = It.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new Ks.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const r = t.fileInfo, n = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: r.info.sha2,
      sha512: r.info.sha512
    };
    this.listenerCount(Vt.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (T) => this.emit(Vt.DOWNLOAD_PROGRESS, T));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = r.packageInfo;
    function s() {
      const T = decodeURIComponent(t.fileInfo.url.pathname);
      return T.endsWith(`.${t.fileExtension}`) ? It.basename(T) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), d = l.cacheDirForPendingUpdate;
    await (0, Wt.mkdir)(d, { recursive: !0 });
    const c = s();
    let f = It.join(d, c);
    const p = a == null ? null : It.join(d, `package-${o}${It.extname(a.path) || ".7z"}`), g = async (T) => (await l.setDownloadedFile(f, p, i, r, c, T), await t.done({
      ...i,
      downloadedFile: f
    }), p == null ? [f] : [f, p]), _ = this._logger, E = await l.validateDownloadedPath(f, i, r, _);
    if (E != null)
      return f = E, await g(!1);
    const S = async () => (await l.clear().catch(() => {
    }), await (0, Wt.unlink)(f).catch(() => {
    })), A = await (0, Ks.createTempUpdateFile)(`temp-${c}`, d, _);
    try {
      await t.task(A, n, p, S), await (0, Ce.retry)(() => (0, Wt.rename)(A, f), 60, 500, 0, 0, (T) => T instanceof Error && /^EBUSY:/.test(T.message));
    } catch (T) {
      throw await S(), T instanceof Ce.CancellationError && (_.info("cancelled"), this.emit("update-cancelled", i)), T;
    }
    return _.info(`New version ${o} has been downloaded to ${f}`), await g(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = (0, Pw.blockmapFiles)(t.url, this.app.version, r.updateInfoAndProvider.info.version);
      this._logger.info(`Download block maps (old: "${a[0]}", new: ${a[1]})`);
      const s = async (c) => {
        const f = await this.httpExecutor.downloadToBuffer(c, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (f == null || f.length === 0)
          throw new Error(`Blockmap "${c.href}" is empty`);
        try {
          return JSON.parse((0, Ow.gunzipSync)(f).toString());
        } catch (p) {
          throw new Error(`Cannot parse blockmap "${c.href}", error: ${p}`);
        }
      }, l = {
        newUrl: t.url,
        oldFile: It.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(Vt.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (c) => this.emit(Vt.DOWNLOAD_PROGRESS, c));
      const d = await Promise.all(a.map((c) => s(c)));
      return await new Iw.GenericDifferentialDownloader(t.info, this.httpExecutor, l).download(d[0], d[1]), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
yt.AppUpdater = Jo;
function Rw(e) {
  const t = (0, Dt.prerelease)(e);
  return t != null && t.length > 0;
}
class Pu {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
yt.NoOpLogger = Pu;
Object.defineProperty(it, "__esModule", { value: !0 });
it.BaseUpdater = void 0;
const Qs = Gr, Dw = yt;
class Nw extends Dw.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Lt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, r = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const n = this.downloadedUpdateHelper, i = this.installerPath, o = n == null ? null : n.downloadedFileInfo;
    if (i == null || o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${r}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: r,
        isAdminRightsRequired: o.isAdminRightsRequired
      });
    } catch (a) {
      return this.dispatchError(a), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  wrapSudo() {
    const { name: t } = this.app, r = `"${t} would like to update"`, n = this.spawnSyncLog("which gksudo || which kdesudo || which pkexec || which beesu"), i = [n];
    return /kdesudo/i.test(n) ? (i.push("--comment", r), i.push("-c")) : /gksudo/i.test(n) ? i.push("--message", r) : /pkexec/i.test(n) && i.push("--disable-internal-agent"), i.join(" ");
  }
  spawnSyncLog(t, r = [], n = {}) {
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const i = (0, Qs.spawnSync)(t, r, {
      env: { ...process.env, ...n },
      encoding: "utf-8",
      shell: !0
    }), { error: o, status: a, stdout: s, stderr: l } = i;
    if (o != null)
      throw this._logger.error(l), o;
    if (a != null && a !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${a}`);
    return s.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((o, a) => {
      try {
        const s = { stdio: i, env: n, detached: !0 }, l = (0, Qs.spawn)(t, r, s);
        l.on("error", (d) => {
          a(d);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
it.BaseUpdater = Nw;
var kr = {}, rn = {};
Object.defineProperty(rn, "__esModule", { value: !0 });
rn.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Yt = St, $w = tn, Fw = Sl;
class xw extends $w.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Iu(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await Lw(this.options.oldFile), i);
  }
}
rn.FileWithEmbeddedBlockMapDifferentialDownloader = xw;
function Iu(e) {
  return JSON.parse((0, Fw.inflateRawSync)(e).toString());
}
async function Lw(e) {
  const t = await (0, Yt.open)(e, "r");
  try {
    const r = (await (0, Yt.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, Yt.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, Yt.read)(t, i, 0, i.length, r - n.length - i.length), await (0, Yt.close)(t), Iu(i);
  } catch (r) {
    throw await (0, Yt.close)(t), r;
  }
}
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.AppImageUpdater = void 0;
const Zs = ge, el = Gr, Uw = St, kw = nt, _r = ie, Mw = it, Bw = rn, jw = de, tl = At;
class Hw extends Mw.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, jw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, Zs.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, a, i, r, t)) && await this.httpExecutor.download(n.url, i, o), await (0, Uw.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, o) {
    try {
      const a = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(tl.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(tl.DOWNLOAD_PROGRESS, s)), await new Bw.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, Zs.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, kw.unlinkSync)(r);
    let n;
    const i = _r.basename(r), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    _r.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = _r.join(_r.dirname(r), _r.basename(o)), (0, el.execFileSync)("mv", ["-f", o, n]), n !== r && this.emit("appimage-filename-updated", n);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, el.execFileSync)(n, [], { env: a })), !0;
  }
}
kr.AppImageUpdater = Hw;
var Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.DebUpdater = void 0;
const qw = it, Gw = de, rl = At;
class Ww extends qw.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Gw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(rl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(rl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const o = ["dpkg", "-i", i, "||", "apt-get", "install", "-f", "-y"];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${o.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
Mr.DebUpdater = Ww;
var Br = {};
Object.defineProperty(Br, "__esModule", { value: !0 });
Br.PacmanUpdater = void 0;
const Vw = it, nl = At, Yw = de;
class zw extends Vw.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Yw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(nl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(nl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.installerPath;
    if (i == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const o = ["pacman", "-U", "--noconfirm", i];
    return this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${o.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
Br.PacmanUpdater = zw;
var jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.RpmUpdater = void 0;
const Xw = it, il = At, Kw = de;
class Jw extends Xw.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, Kw.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(il.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(il.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  doInstall(t) {
    const r = this.wrapSudo(), n = /pkexec/i.test(r) ? "" : '"', i = this.spawnSyncLog("which zypper"), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    let a;
    return i ? a = [i, "--no-refresh", "install", "--allow-unsigned-rpm", "-y", "-f", o] : a = [this.spawnSyncLog("which dnf || which yum"), "-y", "install", o], this.spawnSyncLog(r, [`${n}/bin/bash`, "-c", `'${a.join(" ")}'${n}`]), t.isForceRunAfter && this.app.relaunch(), !0;
  }
}
jr.RpmUpdater = Jw;
var Hr = {};
Object.defineProperty(Hr, "__esModule", { value: !0 });
Hr.MacUpdater = void 0;
const ol = ge, Qi = St, Qw = nt, al = ie, Zw = qf, e_ = yt, t_ = de, sl = Gr, ll = Wr;
class r_ extends e_.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = Lt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
      this._logger.warn(n), this.emit("error", n);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const n = this._logger, i = "sysctl.proc_translated";
    let o = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), o = (0, sl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const p = (0, sl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${p}`), a = a || p;
    } catch (f) {
      n.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    a = a || process.arch === "arm64" || o;
    const s = (f) => {
      var p;
      return f.url.pathname.includes("arm64") || ((p = f.info.url) === null || p === void 0 ? void 0 : p.includes("arm64"));
    };
    a && r.some(s) ? r = r.filter((f) => a === s(f)) : r = r.filter((f) => !s(f));
    const l = (0, t_.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, ol.newError)(`ZIP file not provided: ${(0, ol.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const d = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, p) => {
        const g = al.join(this.downloadedUpdateHelper.cacheDir, c), _ = () => (0, Qi.pathExistsSync)(g) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let E = !0;
        _() && (E = await this.differentialDownloadInstaller(l, t, f, d, c)), E && await this.httpExecutor.download(l.url, f, p);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const p = al.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, Qi.copyFile)(f.downloadedFile, p);
          } catch (p) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${p.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, o = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, Qi.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, Zw.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (d) => {
      const c = d.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((d, c) => {
      const f = (0, ll.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), p = Buffer.from(`autoupdater:${f}`, "ascii"), g = `/${(0, ll.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (_, E) => {
        const S = _.url;
        if (a.info(`${S} requested`), S === "/") {
          if (!_.headers.authorization || _.headers.authorization.indexOf("Basic ") === -1) {
            E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), a.warn("No authenthication info");
            return;
          }
          const $ = _.headers.authorization.split(" ")[1], x = Buffer.from($, "base64").toString("ascii"), [te, se] = x.split(":");
          if (te !== "autoupdater" || se !== f) {
            E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const V = Buffer.from(`{ "url": "${l(this.server)}${g}" }`);
          E.writeHead(200, { "Content-Type": "application/json", "Content-Length": V.length }), E.end(V);
          return;
        }
        if (!S.startsWith(g)) {
          a.warn(`${S} requested, but not supported`), E.writeHead(404), E.end();
          return;
        }
        a.info(`${g} requested by Squirrel.Mac, pipe ${i}`);
        let A = !1;
        E.on("finish", () => {
          A || (this.nativeUpdater.removeListener("error", c), d([]));
        });
        const T = (0, Qw.createReadStream)(i);
        T.on("error", ($) => {
          try {
            E.end();
          } catch (x) {
            a.warn(`cannot end response: ${x}`);
          }
          A = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${$}`));
        }), E.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), T.pipe(E);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${s})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${s})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${p.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : d([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
Hr.MacUpdater = r_;
var qr = {}, Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
Qo.verifySignature = i_;
const cl = ge, Ru = Gr, n_ = Vr, ul = ie;
function i_(e, t, r) {
  return new Promise((n, i) => {
    const o = t.replace(/'/g, "''");
    r.info(`Verifying signature ${o}`), (0, Ru.execFile)('set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", `"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`], {
      shell: !0,
      timeout: 20 * 1e3
    }, (a, s, l) => {
      var d;
      try {
        if (a != null || l) {
          Zi(r, a, l, i), n(null);
          return;
        }
        const c = o_(s);
        if (c.Status === 0) {
          try {
            const _ = ul.normalize(c.Path), E = ul.normalize(t);
            if (r.info(`LiteralPath: ${_}. Update Path: ${E}`), _ !== E) {
              Zi(r, new Error(`LiteralPath of ${_} is different than ${E}`), l, i), n(null);
              return;
            }
          } catch (_) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(d = _.message) !== null && d !== void 0 ? d : _.stack}`);
          }
          const p = (0, cl.parseDn)(c.SignerCertificate.Subject);
          let g = !1;
          for (const _ of e) {
            const E = (0, cl.parseDn)(_);
            if (E.size ? g = Array.from(E.keys()).every((A) => E.get(A) === p.get(A)) : _ === p.get("CN") && (r.warn(`Signature validated using only CN ${_}. Please add your full Distinguished Name (DN) to publisherNames configuration`), g = !0), g) {
              n(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (p, g) => p === "RawData" ? void 0 : g, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), n(f);
      } catch (c) {
        Zi(r, c, null, i), n(null);
        return;
      }
    });
  });
}
function o_(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function Zi(e, t, r, n) {
  if (a_()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, Ru.execFileSync)("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", "ConvertTo-Json test"], { timeout: 10 * 1e3 });
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function a_() {
  const e = n_.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.NsisUpdater = void 0;
const In = ge, fl = ie, s_ = it, l_ = rn, dl = At, c_ = de, u_ = St, f_ = Qo, hl = sr;
class d_ extends s_.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, f_.verifySignature)(n, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, c_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, o, a, s) => {
        const l = n.packageInfo, d = l != null && a != null;
        if (d && t.disableWebInstaller)
          throw (0, In.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !d && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (d || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, In.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await s(), (0, In.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (d && await this.differentialDownloadWebPackage(t, l, a, r))
          try {
            await this.httpExecutor.download(new hl.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, u_.unlink)(a);
            } catch {
            }
            throw f;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let r;
    try {
      if (r = (await this.configOnDisk.value).publisherName, r == null)
        return null;
    } catch (n) {
      if (n.code === "ENOENT")
        return null;
      throw n;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No valid update available, can't quit and install")), !1;
    const n = ["--updated"];
    t.isSilent && n.push("/S"), t.isForceRunAfter && n.push("--force-run"), this.installDirectory && n.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && n.push(`--package-file=${i}`);
    const o = () => {
      this.spawnLog(fl.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((a) => this.dispatchError(a));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(r, n).catch((a) => {
      const s = a.code;
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? o() : s === "ENOENT" ? Lt.shell.openPath(r).catch((l) => this.dispatchError(l)) : this.dispatchError(a);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new hl.URL(r.path),
        oldFile: fl.join(this.downloadedUpdateHelper.cacheDir, In.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(dl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(dl.DOWNLOAD_PROGRESS, a)), await new l_.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
qr.NsisUpdater = d_;
(function(e) {
  var t = le && le.__createBinding || (Object.create ? function(S, A, T, $) {
    $ === void 0 && ($ = T);
    var x = Object.getOwnPropertyDescriptor(A, T);
    (!x || ("get" in x ? !A.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return A[T];
    } }), Object.defineProperty(S, $, x);
  } : function(S, A, T, $) {
    $ === void 0 && ($ = T), S[$] = A[T];
  }), r = le && le.__exportStar || function(S, A) {
    for (var T in S) T !== "default" && !Object.prototype.hasOwnProperty.call(A, T) && t(A, S, T);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = St, i = ie;
  var o = it;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var a = yt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return a.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return a.NoOpLogger;
  } });
  var s = de;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return s.Provider;
  } });
  var l = kr;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var d = Mr;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return d.DebUpdater;
  } });
  var c = Br;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var f = jr;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var p = Hr;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return p.MacUpdater;
  } });
  var g = qr;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return g.NsisUpdater;
  } }), r(At, e);
  let _;
  function E() {
    if (process.platform === "win32")
      _ = new qr.NsisUpdater();
    else if (process.platform === "darwin")
      _ = new Hr.MacUpdater();
    else {
      _ = new kr.AppImageUpdater();
      try {
        const S = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(S))
          return _;
        console.info("Checking for beta autoupdate feature for deb/rpm distributions");
        const A = (0, n.readFileSync)(S).toString().trim();
        switch (console.info("Found package-type:", A), A) {
          case "deb":
            _ = new Mr.DebUpdater();
            break;
          case "rpm":
            _ = new jr.RpmUpdater();
            break;
          case "pacman":
            _ = new Br.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (S) {
        console.warn("Unable to detect 'package-type' for autoUpdater (beta rpm/deb support). If you'd like to expand support, please consider contributing to electron-builder", S.message);
      }
    }
    return _;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => _ || E()
  });
})(tt);
var Du = {}, ut = le && le.__awaiter || function(e, t, r, n) {
  function i(o) {
    return o instanceof r ? o : new r(function(a) {
      a(o);
    });
  }
  return new (r || (r = Promise))(function(o, a) {
    function s(c) {
      try {
        d(n.next(c));
      } catch (f) {
        a(f);
      }
    }
    function l(c) {
      try {
        d(n.throw(c));
      } catch (f) {
        a(f);
      }
    }
    function d(c) {
      c.done ? o(c.value) : i(c.value).then(s, l);
    }
    d((n = n.apply(e, t || [])).next());
  });
}, ft = le && le.__generator || function(e, t) {
  var r = { label: 0, sent: function() {
    if (o[0] & 1) throw o[1];
    return o[1];
  }, trys: [], ops: [] }, n, i, o, a;
  return a = { next: s(0), throw: s(1), return: s(2) }, typeof Symbol == "function" && (a[Symbol.iterator] = function() {
    return this;
  }), a;
  function s(d) {
    return function(c) {
      return l([d, c]);
    };
  }
  function l(d) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; r; ) try {
      if (n = 1, i && (o = d[0] & 2 ? i.return : d[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, d[1])).done) return o;
      switch (i = 0, o && (d = [d[0] & 2, o.value]), d[0]) {
        case 0:
        case 1:
          o = d;
          break;
        case 4:
          return r.label++, { value: d[1], done: !1 };
        case 5:
          r.label++, i = d[1], d = [0];
          continue;
        case 7:
          d = r.ops.pop(), r.trys.pop();
          continue;
        default:
          if (o = r.trys, !(o = o.length > 0 && o[o.length - 1]) && (d[0] === 6 || d[0] === 2)) {
            r = 0;
            continue;
          }
          if (d[0] === 3 && (!o || d[1] > o[0] && d[1] < o[3])) {
            r.label = d[1];
            break;
          }
          if (d[0] === 6 && r.label < o[1]) {
            r.label = o[1], o = d;
            break;
          }
          if (o && r.label < o[2]) {
            r.label = o[2], r.ops.push(d);
            break;
          }
          o[2] && r.ops.pop(), r.trys.pop();
          continue;
      }
      d = t.call(e, r);
    } catch (c) {
      d = [6, c], i = 0;
    } finally {
      n = o = 0;
    }
    if (d[0] & 5) throw d[1];
    return { value: d[0] ? d[1] : void 0, done: !0 };
  }
}, Zo = le && le.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(Du, "__esModule", { value: !0 });
var h_ = _o, Sr = Gr, pl = Zo(nt), ml = Zo(Gf), gl = Zo(Vr), p_ = ar, yl = "yt-dlp", m_ = /\[download\] *(.*) of ([^ ]*)(:? *at *([^ ]*))?(:? *ETA *([^ ]*))?/, g_ = (
  /** @class */
  function() {
    function e(t) {
      t === void 0 && (t = yl), this.binaryPath = t;
    }
    return e.prototype.getBinaryPath = function() {
      return this.binaryPath;
    }, e.prototype.setBinaryPath = function(t) {
      this.binaryPath = t;
    }, e.createGetMessage = function(t) {
      return new Promise(function(r, n) {
        ml.default.get(t, function(i) {
          i.on("error", function(o) {
            return n(o);
          }), r(i);
        });
      });
    }, e.processMessageToFile = function(t, r) {
      var n = pl.default.createWriteStream(r);
      return new Promise(function(i, o) {
        t.pipe(n), t.on("error", function(a) {
          return o(a);
        }), n.on("finish", function() {
          return t.statusCode == 200 ? i(t) : o(t);
        });
      });
    }, e.downloadFile = function(t, r) {
      return ut(this, void 0, void 0, function() {
        var n, i;
        return ft(this, function(o) {
          switch (o.label) {
            case 0:
              n = t, o.label = 1;
            case 1:
              return n ? [4, e.createGetMessage(n)] : [3, 6];
            case 2:
              return i = o.sent(), i.headers.location ? (n = i.headers.location, [3, 5]) : [3, 3];
            case 3:
              return [4, e.processMessageToFile(i, r)];
            case 4:
              return [2, o.sent()];
            case 5:
              return [3, 1];
            case 6:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.getGithubReleases = function(t, r) {
      return t === void 0 && (t = 1), r === void 0 && (r = 1), new Promise(function(n, i) {
        var o = "https://api.github.com/repos/yt-dlp/yt-dlp/releases?page=" + t + "&per_page=" + r;
        ml.default.get(o, { headers: { "User-Agent": "node" } }, function(a) {
          var s = "";
          a.setEncoding("utf8"), a.on("data", function(l) {
            return s += l;
          }), a.on("error", function(l) {
            return i(l);
          }), a.on("end", function() {
            return a.statusCode == 200 ? n(JSON.parse(s)) : i(a);
          });
        });
      });
    }, e.downloadFromGithub = function(t, r, n) {
      return n === void 0 && (n = gl.default.platform()), ut(this, void 0, void 0, function() {
        var i, o, a;
        return ft(this, function(s) {
          switch (s.label) {
            case 0:
              return i = n == "win32", o = "".concat(yl).concat(i ? ".exe" : ""), r ? [3, 2] : [4, e.getGithubReleases(1, 1)];
            case 1:
              r = s.sent()[0].tag_name, s.label = 2;
            case 2:
              return t || (t = "./" + o), a = "https://github.com/yt-dlp/yt-dlp/releases/download/" + r + "/" + o, [4, e.downloadFile(a, t)];
            case 3:
              return s.sent(), !i && pl.default.chmodSync(t, "777"), [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.prototype.exec = function(t, r, n) {
      t === void 0 && (t = []), r === void 0 && (r = {}), n === void 0 && (n = null), r = e.setDefaultOptions(r);
      var i = new h_.EventEmitter(), o = (0, Sr.spawn)(this.binaryPath, t, r);
      i.ytDlpProcess = o, e.bindAbortSignal(n, o);
      var a = "", s;
      return o.stdout.on("data", function(l) {
        return e.emitYoutubeDlEvents(l.toString(), i);
      }), o.stderr.on("data", function(l) {
        return a += l.toString();
      }), o.on("error", function(l) {
        return s = l;
      }), o.on("close", function(l) {
        l === 0 || o.killed ? i.emit("close", l) : i.emit("error", e.createError(l, s, a));
      }), i;
    }, e.prototype.execPromise = function(t, r, n) {
      var i = this;
      t === void 0 && (t = []), r === void 0 && (r = {}), n === void 0 && (n = null);
      var o, a = new Promise(function(s, l) {
        r = e.setDefaultOptions(r), o = (0, Sr.execFile)(i.binaryPath, t, r, function(d, c, f) {
          d && l(e.createError(d, null, f)), s(c);
        }), e.bindAbortSignal(n, o);
      });
      return a.ytDlpProcess = o, a;
    }, e.prototype.execStream = function(t, r, n) {
      t === void 0 && (t = []), r === void 0 && (r = {}), n === void 0 && (n = null);
      var i = new p_.Readable({ read: function(l) {
      } });
      r = e.setDefaultOptions(r), t = t.concat(["-o", "-"]);
      var o = (0, Sr.spawn)(this.binaryPath, t, r);
      i.ytDlpProcess = o, e.bindAbortSignal(n, o);
      var a = "", s;
      return o.stdout.on("data", function(l) {
        return i.push(l);
      }), o.stderr.on("data", function(l) {
        var d = l.toString();
        e.emitYoutubeDlEvents(d, i), a += d;
      }), o.on("error", function(l) {
        return s = l;
      }), o.on("close", function(l) {
        if (l === 0 || o.killed)
          i.emit("close"), i.destroy(), i.emit("end");
        else {
          var d = e.createError(l, s, a);
          i.emit("error", d), i.destroy(d);
        }
      }), i;
    }, e.prototype.getExtractors = function() {
      return ut(this, void 0, void 0, function() {
        var t;
        return ft(this, function(r) {
          switch (r.label) {
            case 0:
              return [4, this.execPromise(["--list-extractors"])];
            case 1:
              return t = r.sent(), [2, t.split(`
`)];
          }
        });
      });
    }, e.prototype.getExtractorDescriptions = function() {
      return ut(this, void 0, void 0, function() {
        var t;
        return ft(this, function(r) {
          switch (r.label) {
            case 0:
              return [4, this.execPromise(["--extractor-descriptions"])];
            case 1:
              return t = r.sent(), [2, t.split(`
`)];
          }
        });
      });
    }, e.prototype.getHelp = function() {
      return ut(this, void 0, void 0, function() {
        var t;
        return ft(this, function(r) {
          switch (r.label) {
            case 0:
              return [4, this.execPromise(["--help"])];
            case 1:
              return t = r.sent(), [2, t];
          }
        });
      });
    }, e.prototype.getUserAgent = function() {
      return ut(this, void 0, void 0, function() {
        var t;
        return ft(this, function(r) {
          switch (r.label) {
            case 0:
              return [4, this.execPromise(["--dump-user-agent"])];
            case 1:
              return t = r.sent(), [2, t];
          }
        });
      });
    }, e.prototype.getVersion = function() {
      return ut(this, void 0, void 0, function() {
        var t;
        return ft(this, function(r) {
          switch (r.label) {
            case 0:
              return [4, this.execPromise(["--version"])];
            case 1:
              return t = r.sent(), [2, t];
          }
        });
      });
    }, e.prototype.getVideoInfo = function(t) {
      return ut(this, void 0, void 0, function() {
        var r;
        return ft(this, function(n) {
          switch (n.label) {
            case 0:
              return typeof t == "string" && (t = [t]), !t.includes("-f") && !t.includes("--format") && (t = t.concat(["-f", "best"])), [4, this.execPromise(t.concat(["--dump-json"]))];
            case 1:
              r = n.sent();
              try {
                return [2, JSON.parse(r)];
              } catch {
                return [2, JSON.parse("[" + r.replace(/\n/g, ",").slice(0, -1) + "]")];
              }
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, e.bindAbortSignal = function(t, r) {
      t == null || t.addEventListener("abort", function() {
        try {
          gl.default.platform() === "win32" ? (0, Sr.execSync)("taskkill /pid ".concat(r.pid, " /T /F")) : (0, Sr.execSync)("pgrep -P ".concat(r.pid, " | xargs -L 1 kill"));
        } catch {
        } finally {
          r.kill();
        }
      });
    }, e.setDefaultOptions = function(t) {
      return t.maxBuffer || (t.maxBuffer = 1024 * 1024 * 1024), t;
    }, e.createError = function(t, r, n) {
      var i = `
Error code: ` + t;
      return r && (i += `

Process error:
` + r), n && (i += `

Stderr:
` + n), new Error(i);
    }, e.emitYoutubeDlEvents = function(t, r) {
      for (var n = t.split(/\r|\n/g).filter(Boolean), i = 0, o = n; i < o.length; i++) {
        var a = o[i];
        if (a[0] == "[") {
          var s = a.match(m_);
          if (s) {
            var l = {};
            l.percent = parseFloat(s[1].replace("%", "")), l.totalSize = s[2].replace("~", ""), l.currentSpeed = s[4], l.eta = s[6], r.emit("progress", l);
          }
          var d = a.split(" ")[0].replace("[", "").replace("]", ""), c = a.substring(a.indexOf(" "), a.length);
          r.emit("ytDlpEvent", d, c);
        }
      }
    }, e;
  }()
), El = Du.default = g_;
const vl = Wf(import.meta.url), pi = ee.dirname(Bf(import.meta.url));
process.env.APP_ROOT = ee.join(pi, "..");
process.on("uncaughtException", (e) => {
  console.error("Uncaught Exception:", e);
  try {
    const t = ee.join(process.env.APP_ROOT || pi, "error_log.txt"), r = `[${(/* @__PURE__ */ new Date()).toISOString()}] Uncaught Exception: ${e.message}
Stack: ${e.stack}

`;
    J.appendFileSync(t, r);
  } catch (t) {
    console.error("Failed to write to error log:", t);
  }
});
process.on("unhandledRejection", (e, t) => {
  console.error("Unhandled Rejection at:", t, "reason:", e);
  try {
    const r = ee.join(process.env.APP_ROOT || pi, "error_log.txt"), n = `[${(/* @__PURE__ */ new Date()).toISOString()}] Unhandled Rejection: ${e}

`;
    J.appendFileSync(r, n);
  } catch (r) {
    console.error("Failed to write to error log:", r);
  }
});
const Eo = process.env.VITE_DEV_SERVER_URL, k_ = ee.join(process.env.APP_ROOT, "dist-electron"), Nu = ee.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Eo ? ee.join(process.env.APP_ROOT, "public") : Nu;
let fe;
function $u() {
  fe = new vo({
    width: 1e3,
    height: 800,
    title: "SoundMancer",
    icon: ee.join(process.env.VITE_PUBLIC, "logo.jpg"),
    webPreferences: {
      preload: ee.join(pi, "preload.mjs")
    },
    autoHideMenuBar: !0
    // Auto hide
  }), fe.setMenu(null), fe.webContents.on("did-finish-load", () => {
    fe && !fe.isDestroyed() && fe.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), Eo ? fe.loadURL(Eo) : fe.loadFile(ee.join(Nu, "index.html"));
}
tt.autoUpdater.logger = console;
tt.autoUpdater.on("checking-for-update", () => {
  console.log("Checking for updates...");
});
tt.autoUpdater.on("error", (e) => {
  console.error("Error in auto-updater: ", e);
});
tt.autoUpdater.on("update-available", () => {
  fe && !fe.isDestroyed() && fe.webContents.send("update-available");
});
tt.autoUpdater.on("update-downloaded", () => {
  fe && !fe.isDestroyed() && fe.webContents.send("update-downloaded");
});
$e.on("window-all-closed", () => {
  process.platform !== "darwin" && ($e.quit(), fe = null);
});
$e.on("will-quit", () => {
  eo.unregisterAll();
});
$e.on("activate", () => {
  vo.getAllWindows().length === 0 && $u();
});
$e.whenReady().then(() => {
  try {
    tt.autoUpdater.checkForUpdatesAndNotify();
  } catch (o) {
    console.error("Auto-update check failed:", o);
  }
  Uf.registerFileProtocol("media", (o, a) => {
    const s = o.url.substr(8), l = decodeURI(s);
    a({ path: l });
  }), $u();
  const e = ee.join($e.getPath("userData"), "sounds.json");
  be.handle("read-file", async (o, a) => {
    try {
      return await J.promises.readFile(a);
    } catch (s) {
      throw console.error("Failed to read file", s), s;
    }
  }), be.handle("load-sounds", async () => {
    try {
      if (!J.existsSync(e)) return [];
      const o = await J.promises.readFile(e, "utf-8");
      return JSON.parse(o);
    } catch (o) {
      return console.error("Failed to load sounds:", o), [];
    }
  }), be.handle("save-sounds", async (o, a) => {
    try {
      return await J.promises.writeFile(e, JSON.stringify(a, null, 2)), { success: !0 };
    } catch (s) {
      return console.error("Failed to save sounds:", s), { success: !1, error: s };
    }
  }), be.handle("save-audio-file", async (o, { buffer: a, name: s }) => {
    try {
      const l = ee.join($e.getPath("userData"), "sounds");
      J.existsSync(l) || await J.promises.mkdir(l, { recursive: !0 });
      const c = `${s.replace(/[^a-z0-9]/gi, "_").toLowerCase()}-${Date.now()}.wav`, f = ee.join(l, c);
      return await J.promises.writeFile(f, Buffer.from(a)), f;
    } catch (l) {
      throw console.error("Failed to save audio file:", l), l;
    }
  }), be.handle("delete-sound-file", async (o, a) => {
    try {
      if (!a) return !1;
      const s = $e.getPath("userData"), l = ee.normalize(a), d = ee.normalize(s);
      return l.startsWith(d) ? J.existsSync(l) ? (await J.promises.unlink(l), !0) : !1 : (console.warn("Attempted to delete file outside userData:", a), !1);
    } catch (s) {
      return console.error("Failed to delete file:", s), !1;
    }
  }), be.handle("open-sounds-folder", async () => {
    const o = ee.join($e.getPath("userData"), "sounds");
    return J.existsSync(o) || await J.promises.mkdir(o, { recursive: !0 }), await kf.openPath(o), !0;
  }), be.handle("search-sounds", async (o, { query: a, page: s = 1 }) => {
    try {
      const l = await fetch(`https://www.myinstants.com/api/v1/instants/?format=json&name=${encodeURIComponent(a)}&page=${s}`);
      if (!l.ok) throw new Error("API request failed");
      const d = await l.json();
      return {
        results: d.results.map((f) => {
          var p;
          return {
            id: ((p = f.id) == null ? void 0 : p.toString()) || Math.random().toString(),
            name: f.name,
            url: f.sound,
            icon: f.image || void 0,
            color: f.color,
            description: f.description
          };
        }),
        count: d.count,
        next: d.next
      };
    } catch (l) {
      return console.error("Search failed:", l), { results: [], count: 0, next: null };
    }
  }), be.handle("toggle-mini-mode", async (o, a) => {
    const s = vo.getAllWindows()[0];
    s && (a ? (s.setSize(300, 400), s.setAlwaysOnTop(!0, "screen-saver")) : (s.setSize(1e3, 800), s.setAlwaysOnTop(!1)));
  }), be.handle("download-sound", async (o, { url: a, fileName: s }) => {
    try {
      const l = await fetch(a);
      if (!l.ok) throw new Error("Download failed");
      const d = await l.arrayBuffer(), c = ee.join($e.getPath("userData"), "downloaded_sounds");
      J.existsSync(c) || await J.promises.mkdir(c, { recursive: !0 });
      const f = s.replace(/[^a-z0-9]/gi, "_").toLowerCase(), p = ee.extname(a) || ".mp3", g = ee.join(c, `${f}-${Date.now()}${p}`);
      return await J.promises.writeFile(g, Buffer.from(d)), g;
    } catch (l) {
      throw console.error("Download failed:", l), l;
    }
  });
  const t = ee.join($e.getPath("userData"), "yt-dlp.exe"), r = new El(t), n = async () => {
    const o = ee.join($e.getPath("userData"), "bin");
    J.existsSync(o) || await J.promises.mkdir(o, { recursive: !0 });
    const a = vl("ffmpeg-static"), s = vl("ffprobe-static").path, l = ee.join(o, "ffmpeg.exe"), d = ee.join(o, "ffprobe.exe");
    return J.existsSync(l) || await J.promises.copyFile(a, l), J.existsSync(d) || await J.promises.copyFile(s, d), o;
  }, i = async () => {
    J.existsSync(t) || (console.log("Downloading yt-dlp binary to", t), await El.downloadFromGithub(t), console.log("yt-dlp binary downloaded!"));
  };
  be.handle("download-youtube-audio", async (o, { url: a, start: s, end: l }) => {
    try {
      if (!a) throw new Error("No URL provided");
      await i();
      const d = await n(), c = $e.getPath("temp"), f = `yt_clip_${Date.now()}.mp3`, p = ee.join(c, f), g = [
        a,
        "-v",
        "--force-ipv4",
        "-f",
        "bestaudio/best",
        "-x",
        "--audio-format",
        "mp3",
        "--ffmpeg-location",
        d,
        "-o",
        p
      ];
      return s !== void 0 && l !== void 0 && (g.push("--download-sections", `*${s}-${l}`), g.push("--force-keyframes-at-cuts")), new Promise((_, E) => {
        const S = r.exec(g);
        S.on("progress", (A) => {
          o.sender.isDestroyed() || o.sender.send("download-progress", A.percent);
        }), S.on("ytDlpEvent", (A, T) => {
          o.sender.isDestroyed() || (A === "youtube" ? T.includes("Downloading webpage") ? o.sender.send("download-progress", 10) : T.includes("Extracting URL") && o.sender.send("download-progress", 5) : A === "info" && T.includes("Downloading 1 time ranges") && o.sender.send("download-progress", 25)), A === "error" && console.error(`[yt-dlp] ${T}`);
        }), S.on("error", (A) => {
          console.error("yt-dlp error:", A), E(A);
        }), S.on("close", () => {
          console.log("yt-dlp process closed"), _(p);
        });
      });
    } catch (d) {
      console.error("YouTube download failed:", d);
      const c = ee.join(process.env.APP_ROOT, "error_log.txt"), f = `[${(/* @__PURE__ */ new Date()).toISOString()}] Error: ${d.message}
Stack: ${d.stack}

`;
      throw J.appendFileSync(c, f), d;
    }
  }), be.handle("update-global-shortcuts", (o, a) => (eo.unregisterAll(), a.forEach((s) => {
    if (s.keybind && s.keybind.trim() !== "")
      try {
        eo.register(s.keybind, () => {
          fe && !fe.isDestroyed() && fe.webContents.send("play-sound", s.id);
        }) || console.warn(`Registration failed for shortcut: ${s.keybind}`);
      } catch (l) {
        console.error(`Failed to register shortcut ${s.keybind}:`, l);
      }
  }), !0)), be.handle("check-for-updates", () => {
    tt.autoUpdater.checkForUpdatesAndNotify();
  }), be.handle("quit-and-install", () => {
    tt.autoUpdater.quitAndInstall();
  }), be.handle("get-app-version", () => $e.getVersion()), be.handle("export-sound", async (o, { name: a, path: s }) => {
    try {
      const { filePath: l } = await Mf.showSaveDialog(fe, {
        title: `Save ${a}`,
        defaultPath: `${a}.mp3`,
        filters: [
          { name: "Audio Files", extensions: ["mp3", "wav", "ogg"] }
        ]
      });
      if (!l) return !1;
      let d = s;
      if (d.startsWith("media://"))
        d = d.replace("media://", ""), d = decodeURI(d);
      else if (d.startsWith("http")) {
        const c = await fetch(d);
        if (!c.ok) throw new Error("Download failed");
        const f = await c.arrayBuffer();
        return await J.promises.writeFile(l, Buffer.from(f)), !0;
      }
      return await J.promises.copyFile(d, l), !0;
    } catch (l) {
      return console.error("Export failed:", l), !1;
    }
  });
});
export {
  k_ as MAIN_DIST,
  Nu as RENDERER_DIST,
  Eo as VITE_DEV_SERVER_URL
};
