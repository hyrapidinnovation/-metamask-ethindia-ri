import { OnRpcRequestHandler } from '@metamask/snap-types';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import crypto from 'node:crypto';

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
 export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  const ethNode = await wallet.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 60,
    },
  });

  const deriveEthAddress = await getBIP44AddressKeyDeriver(ethNode);

  switch (request.method) {
    case 'encrypt_buffer':{

      const addressKey0 = await deriveEthAddress(0);

      const encrypted = crypto.privateEncrypt(addressKey0.privateKey, request?.params[0])

      const res = await wallet.request({
              method: 'snap_confirm',
              params: [
                {
                  prompt: getMessage(origin),
                  description:
                    'This custom confirmation is not just for display purposes.',
                  textAreaContent:
                    JSON.stringify(encrypted),
                },
              ],
            });  
      return res;
          };
    case 'decrypt_buffer':{

      const res = await wallet.request({
              method: 'snap_confirm',
              params: [
                {
                  prompt: getMessage(origin),
                  description:
                    'This custom confirmation is not just for display purposes.',
                  textAreaContent:
                    "JSON.stringify(addressKey0)",
                },
              ],
            });  
      return res;
          };
    default:
      throw new Error('Method not found.');
  }
};