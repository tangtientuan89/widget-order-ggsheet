<template>
  <div>
    <div class="auth__modal d-flex justify-content-center align-items-center" v-if="is_auth_modal">
      <Help :handleHelpHide="handleHelpHide" />
    </div>
    <div class="container">
      <!-- OAuth -->
      <div v-if="!is_oauth&&show_form_oauth&&is_login">
        <div class="auth__activate">
          <div>
            <img
              class="auth__activate--icon-help"
              src="./assets/help.png"
              alt="Hướng dẫn"
              title="Hướng dẫn"
              @click="handleHelpShow"
            />
          </div>
          <p>URL Google Form</p>
          <input
            v-model="url_ggform"
            type="text"
            class="form-control mt-3"
            placeholder="Nhập URL Google Form..."
          />
          <div>
            <button class="auth__run btn btn-danger" @click="runOAuth()">Kích hoạt</button>
          </div>
        </div>
      </div>
      <!-- warning -->
      <div v-if="is_oauth&&show_form_oauth&&!is_login" class="container">
        <div class="auth__activate">
          <div class="text-center">
            <img src="./assets/error.png" alt />
          </div>
          <p class="mb-0">Xin vui lòng kích hoạt lại ứng dụng</p>
        </div>
      </div>
    </div>
    <!-- form -->
    <div v-if="is_oauth&&!show_form_oauth" style="height:100%">
      <Form :payload="payload" />
    </div>
  </div>
</template>

<script>
import fetch from "@/services/resful.js";
import Form from "@/components/Form";
import Help from "@/components/help/Help.vue";

// domain  "https://chatbox-app.botbanhang.vn/order-google-form";
// const APIBase = "https://chatbox-app.botbanhang.vn"; //product
const APIBase = "https://app.devchatbox.tk";
const API =
  "https://chatbox-widget.botbanhang.vn/v1/widget-order-ggform/GGForm/get-html";

export default {
  components: {
    Form,
    Help,
  },
  data() {
    return {
      is_oauth: false,
      show_form_oauth: false,
      is_login: false,
      is_auth_modal: false,
      path: "",
      access_token: "",
      // secret_key: "98996b4986ad441bafcddafbc3968ed7", //product
      secret_key: "7bd46085a2874c7d9f1920f26f3dcec1",
      payload: {
        to_name: "",
        to_phone: "",
      },
      url_ggform: "",
      handle_api: true,
      entry: [],
    };
  },
  mounted() {
    this.getParams();
    this.partnerAuth();
  },
  created() {},

  methods: {
    getParams() {
      let url = new URL(window.location.href);
      this.path = window.location.hash;
      if (this.path.includes("#/auth?")) {
        url = new URL(window.location.href.replace("#/auth?", ""));
        this.is_login = url.searchParams.get("login");
      }
      this.access_token = url.searchParams.get("access_token");
      // console.log("access_token", this.access_token);
    },
    checkLocalStorage() {
      let data_localStorage = JSON.parse(
        localStorage.getItem("widget_order_ggsheet")
      );
      // console.log("widget_order_ggsheet", data_localStorage);
      if (!data_localStorage) {
        this.is_login = false;
        this.show_form_oauth = true;
        return;
      }
      // console.log("111111111111111111", data_localStorage.url_ggform);
      this.url_ggform = data_localStorage.url_ggform;
    },
    async partnerAuth() {
      try {
        let body = {
          access_token: this.access_token,
          secret_key: this.secret_key,
        };

        let get_customer_info = await fetch.post(
          `${APIBase}/v1/service/partner-authenticate`,
          body
        );

        console.log("get_customer_info", get_customer_info);
        if (
          get_customer_info &&
          get_customer_info.data &&
          get_customer_info.data.data &&
          get_customer_info.data.succes &&
          get_customer_info.data.code == 200
        ) {
          if (get_customer_info.data.data.public_profile) {
            this.is_oauth = true;
            this.payload.to_name =
              get_customer_info.data.data.public_profile.client_name;
            if (
              get_customer_info.data.data.conversation_contact &&
              get_customer_info.data.data.conversation_contact.client_phone
            ) {
              this.payload.to_phone =
                get_customer_info.data.data.conversation_contact.client_phone;
            }
            this.checkLocalStorage();
          }
        }
      } catch (e) {
        console.log(e);
        this.is_oauth = false;
        this.show_form_oauth = true;
      }
    },
    async runOAuth() {
      try {
        let body = {
          _type: "oauth-access-token",
          access_token: this.access_token,
          token_partner: "active",
        };

        let oauth = await fetch.post(
          `${APIBase}/v1/app/app-installed/update`,
          body
        );

        let check_url = await this.btnCheck();

        if (check_url) {
          setTimeout(() => {
            this.is_oauth = true;
            this.show_form_oauth = false;
            window.close();
          }, 1000);
        }
      } catch (e) {
        this.swalToast("Kích hoạt thất bại", "error");
        console.log(e);
      }
    },

    async btnCheck() {
      try {
        let url_ggform = this.checkUrl(this.url_ggform);
        if (!url_ggform) return;
        if (!this.handle_api) return;
        this.handle_api = false;
        Swal.showLoading();
        let res = await fetch.post(API, { url_ggform: url_ggform }); //API get HTML formGGSheet
        Swal.hideLoading();
        if (res && res.data && res.data.data) {
          let html = res.data.data.body;
          let entry = this.detectHTML(html); // detect entry from response
          if (!entry.length) return this.swalToast("URL sai", "error");
          localStorage.removeItem('widget_order_ggsheet')
          localStorage.setItem(
            "widget_order_ggsheet",
            JSON.stringify({
              url_ggform: url_ggform,
              entry: entry,
            })
          );
          $("#url-sheet").html("");
          this.url_ggform = url_ggform;
          this.handle_api = true;
          this.swalToast("Thành công", "success");
          return true;
        }
      } catch (e) {
        this.handle_api = true;
        this.swalToast("URL lỗi", "error");
        Swal.hideLoading();
        console.log("e", e);
      }
    },
    detectHTML(html) {
      if (!html) return;
      let arr = html.split("data-params=");
      // console.log("split arr", arr);
      arr.shift();
      // console.log("split arr", arr);
      let entry = [];
      for (let i = 0; i < arr.length; i++) {
        let e = arr[i].split(",[[")[1].split(",")[0];
        entry.push(e);
      }
      // console.log("text arr", entry);
      this.entry = entry;
      return entry;
    },
    checkUrl(url) {
      let search_in_url = url.search("docs.google.com");
      console.log("search_in_url", search_in_url);
      if (search_in_url == -1) {
        this.swalToast("URL sai", "error");
        return false;
      }
      let arr_string = url.split("/");
      let id_ggsheet = "";
      for (let i = 0; i < arr_string.length; i++) {
        if (arr_string[i].length > id_ggsheet.length)
          id_ggsheet = arr_string[i];
      }
      // console.log("id_ggsheet", id_ggsheet);
      return `https://docs.google.com/forms/d/e/${id_ggsheet}/formResponse`;
    },
    handleHelpShow() {
      this.is_auth_modal = true;
    },
    handleHelpHide() {
      this.is_auth_modal = false;
    },
    swalToast(title, icon) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: false,
        onOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: icon,
        title: title,
        padding: "5px",
      });
    },
  },
};
</script>

<style lang="scss">
$colorBG: #f6f6f6;
// *::-webkit-scrollbar {
//   width: 0px;
//   background-color: #0199ff;
// }
* {
  font-size: 13px;
}
body > div {
  margin: 0;
  padding: 0;
}
.auth__modal {
  background: rgba(0, 0, 0, 0.5);
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  z-index: 99;
}
.auth__activate {
  background: $colorBG;
  position: relative;
  border: 2px solid rgba(0, 0, 0, 0.125);
  border-radius: 10px;
  margin-top: 20%;
  padding: 10% 10% 5% 10%;
  .auth__activate--icon-help {
    position: absolute;
    top: 15px;
    right: 15px;
    height: 30px;
    width: 30px;
    cursor: pointer;
  }
  input {
    margin-bottom: 50px;
  }
  div {
    text-align: center;
  }
  p {
    text-align: center;
    font-weight: 700;
  }
}
.auth__run {
  padding: 10px 35px;
  /* transform: translateX(-50%); */
  box-shadow: 0 5px 15px 0 #dc354530;
  /* transition: all 0.5s; */
  border-radius: 25px;
}
.auth__run:hover {
  background: #dc3545;
  box-shadow: 0 5px 20px 0 #dc354530;
}
.auth__run:focus {
  box-shadow: 0 5px 20px 0 #dc354530 !important;
  background: #dc3545 !important;
}
.form-control-sm {
  height: calc(1.5em + 0.5rem + 2px);
  width: 100%;
  padding: 0.25rem 0.5rem;
  color: #000000;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 0.2rem;
  /* border: 1px solid #ced4da; */
  border: none;
  // appearance: none;
  background: #eee;
  background-clip: padding-box;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  option {
    background: #ffffff;
  }
  &:focus {
    box-shadow: none;
    background: #eee;
    outline: none;
    // border: none;
  }
}
.all__text--decoration {
  text-align: center;
  width: 100px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -70%);
  background: #fff;
  font-size: 1rem;
  color: #777777;
}
.btn-pill {
  font-size: 0.9rem;
  background: #0d6efd;
  color: #ffffff;
  height: 2rem;
  outline: none;
  border: none;
  border-radius: 1rem;
  -webkit-box-shadow: 0px 1px 3px rgba(126, 142, 177, 0.2);
  box-shadow: 0 1px 3px rgba(126, 142, 177, 0.2);
  &:hover {
    background: #0167ff;
    transition: transform 0.15s, background 0.15s;
    -webkit-transform: scale(1.03);
    transform: scale(1.03);
    -webkit-box-shadow: 0px 1px 3px rgba(126, 142, 177, 0.2);
    box-shadow: 0px 1px 3px rgba(126, 142, 177, 0.2);
  }
  &:focus{
    outline: none;
  }
}
</style>