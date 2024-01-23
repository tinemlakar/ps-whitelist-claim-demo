<template>
  <n-data-table
    :bordered="false"
    :columns="columns"
    :data="users"
    :pagination="{ pageSize: PaginationValues.PAGE_DEFAULT_LIMIT }"
  />
</template>

<script lang="ts" setup>
import { isAddress } from 'web3-validator';
import type { DataTableColumns } from 'naive-ui';
import { NInput } from 'naive-ui';
import { PaginationValues } from '~/lib/values/general.values';

const props = defineProps({
  users: { type: Array<UserInterface>, required: true },
});
const emit = defineEmits(['addUser', 'removeUser']);
const message = useMessage();

const newUser = ref<UserInterface>({
  signature: null,
  wallet: null,
});

function isEditable(row: UserInterface, index: number) {
  return !row.wallet && props.users.length === index + 1;
}

const createColumns = (): DataTableColumns<UserInterface> => {
  return [
    {
      key: 'wallet',
      title: 'Wallet',
      minWidth: 100,
      render(row: UserInterface, index: number) {
        if (isEditable(row, index)) {
          return h(NInput, {
            value: newUser.value.wallet,
            type: 'wallet',
            onUpdateValue(v) {
              newUser.value.wallet = v;
            },
          });
        } else {
          return h(resolveComponent('TableEllipsis'), { text: row.wallet }, '');
        }
      },
    },
    {
      key: 'signature',
      title: 'Signature',
      minWidth: 100,
      render(row: UserInterface) {
        return h(resolveComponent('TableEllipsis'), { text: row.signature }, '');
      },
    },
    {
      key: 'action_remove',
      title: '',
      render(row: UserInterface, index: number) {
        if (isEditable(row, index)) {
          return h(
            'button',
            { class: 'icon-check text-xl text-green', onClick: () => addItem(row) },
            ''
          );
        } else if (!row.id) {
          return h(
            'button',
            { class: 'icon-delete text-xl text-white', onClick: () => removeItem(row) },
            ''
          );
        }
        return '';
      },
    },
  ];
};
const columns = createColumns();

function addItem(user: UserInterface) {
  if (!newUser.value.wallet) {
    message.warning('Please enter your wallet');
    return;
  } else if (!isAddress(newUser.value.wallet)) {
    message.warning('Wrong wallet address, please use EVM wallet');
    return;
  }

  user.signature = newUser.value.signature;
  user.wallet = newUser.value.wallet;
  newUser.value.signature = null;
  newUser.value.wallet = null;

  emit('addUser', newUser.value);
}

function removeItem(user: UserInterface) {
  emit('removeUser', user.wallet);
}
</script>
