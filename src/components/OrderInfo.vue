<template>
  <div>
    <div :class="[ 'order-info', { 'show-order-info': is_show_order_info }]">
      <div class="text-center" v-if="is_show_order_info">
        <button class="close" @click="handleCloseOrderInfo">
          <img src="../assets/multiply.png" />
        </button>
        <p class="mt-2 mb-3 font-weight-bold">Thông tin đơn hàng</p>
        <p class>Khách hàng: {{info.name}}</p>
        <p class>Số điện thoại: {{info.phone}}</p>
        <p class>Địa chỉ: {{info.address}}</p>
        <p class>Sản phẩm: {{info.product}}</p>
        <p v-if="info.note">Ghi chú: {{info.note}}</p>
        <p class="font-weight-bold" style="font-size:16">Giá trị đơn hàng: {{info.total_price}}</p>
        <button @click="createOrder()" class="btn-pill mt-3 mb-4 w-100 font-weight-bold">
          Xác nhận
          đơn
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["info", "is_show_order_info", "handleCloseOrderInfo", "createOrder"],
};
</script>

<style lang="scss" scoped>
$fontSize: 13px;
* {
  font-size: $fontSize;
  line-height: 16px;
}
.order-info {
  position: fixed;
  bottom: 50%;
  left: 0;
  height: 0;
  width: 100%;
  opacity: 0;
  background: #fff;
  box-shadow: 0 0 20px 0 #0005;
  transition: all 0.5s ease;
  overflow: hidden;
  padding: 0;
  border-radius: 15px 15px 0 0;
}

.order-info::-webkit-scrollbar {
  display: none;
}
.show-order-info {
  bottom: 0;
  max-height: 90vh;
  overflow-y: scroll;
  height: initial;
  opacity: 1;
  padding: 10px;
}
.order-info .close {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 10px;
  right: 10px;
  opacity: 1;
  border-radius: 50%;
}
.order-info .close:hover {
  opacity: 1 !important;
}
.order-info .close img {
  width: 100%;
  height: 100%;
  filter: invert(30%) sepia(96%) saturate(2052%) hue-rotate(198deg)
    brightness(99%) contrast(108%);
}
.order-info .close:focus {
  outline: none;
}
</style>