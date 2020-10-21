<template>
  <div class="help">
    <div class="close__icon" @click="handleHelpHide">
      <img src="../../assets/close.png" alt />
    </div>
    <p class="help__text--bold">Bước 1: Tạo 1 Google Form.</p>
    <p>
      Tạo mới Google Form tại
      <a
        href="https://docs.google.com/forms/u/0/"
        target="_blank"
      >https://docs.google.com/forms/u/0/</a> với các câu hỏi (question) và trả lời (answer) theo thứ tự như sau:
    </p>
    <ul>
      <li>Họ Tên</li>
      <li>Số điện thoại</li>
      <li>Địa chỉ</li>
      <li>Sản phẩm</li>
      <li>Tổng giá đơn hàng</li>
      <li>Ghi chú</li>
    </ul>
    <span class="help__text--bold">Chú ý:</span>
    <span>Các câu hỏi phải sắp xếp theo đúng thứ tự, nếu không đúng sẽ làm sai lệch dữ liệu.Sau khi tạo xong Form, hãy click vào xem trước (preview).</span>
    <p>
      Chuyển sang tab xem trước (preview) và copy URL có dạng như mẫu sau:
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeHCFSe6uuKKRY8RntR4vHhd7Eac5Pb_yubYHpK30K_EvCHEA/viewform"
      >Click tại đây</a>
    </p>
    <p
      class="help__text--bold"
    >Bước 2: Tại giao diện kích hoạt Widget hãy dán (paste) URL vừa copy ở Bước 1 vào.</p>
    <p>
      URL sheet mẫu sau khi tạo đơn
      <a
        href="https://docs.google.com/spreadsheets/d/1KkrTpl6ZfQgLiY-WH3SUlhbGKW8wdIZL305RuqrjWL8/edit#gid=1640135604"
        target="_blank"
      >Click tại đây</a>
    </p>
  </div>
</template>

<script>
export default {
  props: ["handleHelpHide"],
};
</script>

<style lang="scss" scoped>
.help {
  margin: 0 5rem 0 5rem;
  padding: 2rem;
  background: white;
  opacity: 1;
  z-index: 999;
  border: rgb(225, 225, 225);
  border-radius: 10px;
  box-shadow: 0.5px 1px 4px 0 rgba(0, 0, 0, 0.2);
}
.help__text--bold {
  font-weight: bold;
}
.close__icon {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 10px;
  right: 10px;
  opacity: 1;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
    // filter: invert(30%) sepia(96%) saturate(2052%) hue-rotate(198deg)
    //   brightness(99%) contrast(108%);
  }
  &:hover {
    opacity: 1 !important;
    cursor: pointer;
  }
  &:focus {
    outline: none;
  }
}
</style>