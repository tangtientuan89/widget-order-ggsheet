<template>
  <div class="container">
    <!-- OAuth -->
    <div v-if="!is_oauth&&show_form_oauth">
      <div class="activate">
        <p>URL Google Form</p>
        <input
          v-model="url_ggform"
          type="text"
          class="form-control mt-3"
          placeholder="Nhập URL Google Form..."
        />
        <div>
          <button class="auth btn btn-danger" @click="runOAuth()">Kích hoạt</button>
        </div>
      </div>
    </div>
    <!-- form -->
    <div v-if="is_oauth" style="height:100%">
      <p class="text-center pt-2 mb-4" style="font-size:1rem; font-weight:600">ORDER GOOGLE SHEET</p>
      <Form :name="name" :phone="phone" />
    </div>
  </div>
</template>

<script>
import fetch from "@/services/resful.js";
import Form from "@/components/Form";

// const domain = "https://chatbox-app.botbanhang.vn/order-google-form";
// const APIBase = "https://chatbox-app.botbanhang.vn";
const APIBase = "https://app.devchatbox.tk";

const API =
  "https://chatbox-widget.botbanhang.vn/v1/widget-order-ggform/GGForm/get-html";
let url_string = location.href;
let url = new URL(url_string);
let access_token = url.searchParams.get("access_token");

export default {
  components: {
    Form: Form,
  },
  data() {
    return {
      is_oauth: false,
      show_form_oauth: false,
      access_token: access_token,
      // secret_key: "98996b4986ad441bafcddafbc3968ed7", //product
      secret_key: "7bd46085a2874c7d9f1920f26f3dcec1",
      content: "",
      allNote: [],
      payload: "",
      name: "",
      phone: "",

      page: 1,
      list: [],
      infiniteId: +new Date(),

      url_ggform: "",
      handle_api: true,
      entry: [],
    };
  },
  mounted() {
    let data_localStorage = JSON.parse(
      localStorage.getItem("widget_order_ggsheet")
    );
    console.log("widget_order_ggsheet", data_localStorage);
    if(!data_localStorage.url_ggform)
    return this.show_form_oauth =true
    this.url_ggform = data_localStorage.url_ggform;
  },
  async created() {
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
      if (get_customer_info.data.succes && get_customer_info.data.code == 200) {
        this.is_oauth = true;
        this.name = get_customer_info.data.data.public_profile.client_name;
        if (get_customer_info.data.data.conversation_contact.client_phone)
          this.phone =
            get_customer_info.data.data.conversation_contact.client_phone;
      }
      console.log("name phone", this.name, this.phone);
    } catch (e) {
      console.log(e);
      this.show_form_oauth = true;
    }
  },

  methods: {
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
          }, 500);
        }
      } catch (e) {
        this.swalToast("OAuth error", "error");
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
        // console.log("res data form", res.data.data.body);
        Swal.hideLoading();
        let html = res.data.data.body;
        let entry = this.detectHTML(html); // detect entry from response
        if (!entry.length) return this.swalToast("URL sai", "error");
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
      } catch (e) {
        this.handle_api = true;
        this.swalToast("URL lỗi", "error");
        Swal.hideLoading();
        console.log("e", e);
      }
    },
    detectHTML(html) {
      let arr = html.split("data-params=");
      console.log("split arr", arr);
      arr.shift();
      console.log("split arr", arr);
      let entry = [];
      for (let i = 0; i < arr.length; i++) {
        let e = arr[i].split(",[[")[1].split(",")[0];
        entry.push(e);
      }
      console.log("text arr", entry);
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
      console.log("id_ggsheet", id_ggsheet);
      return `https://docs.google.com/forms/d/e/${id_ggsheet}/formResponse`;
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

<style lang="scss" scoped>
$colorBG: #f6f6f6;
// *::-webkit-scrollbar {
//   width: 0px;
//   background-color: #0199ff;
// }

.activate {
  background: $colorBG;
  border: 2px solid rgba(0, 0, 0, 0.125);
  border-radius: 10px;
  margin-top: 20%;
  padding: 10% 10% 5% 10%;
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

.auth {
  padding: 10px 35px;
  /* transform: translateX(-50%); */
  box-shadow: 0 5px 15px 0 #dc354530;
  /* transition: all 0.5s; */
  border-radius: 25px;
}
.auth:hover {
  background: #dc3545;
  box-shadow: 0 5px 20px 0 #dc354530;
}
.auth:focus {
  box-shadow: 0 5px 20px 0 #dc354530 !important;
  background: #dc3545 !important;
}
</style>