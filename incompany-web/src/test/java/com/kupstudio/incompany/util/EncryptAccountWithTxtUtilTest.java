package com.kupstudio.incompany.util;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

public class EncryptAccountWithTxtUtilTest {

    private static final String ENCRYPT_KEY_ACCOUNT_NO = "_bank_account_no";

    public static void main(String[] args) throws Exception {
        String txtFile = "C:/Users/82103/Documents/HeidiSQL/65updateRealAccountNo.txt";

        List<UserData> userDataList = readUserDataFromTxt(txtFile);

        for (UserData userData : userDataList) {
            int contractCode = userData.getContractCode();
            String accountNo = userData.getAccountNo();
            String encryptedAccountNo = encryptAes(accountNo, ENCRYPT_KEY_ACCOUNT_NO);
            String query = generateUpdateQuery(contractCode, encryptedAccountNo);
            System.out.println(query);
        }
    }

    public static List<UserData> readUserDataFromTxt(String txtFile) {
        List<UserData> userDataList = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(txtFile))) {
            String header = br.readLine(); // 첫 번째 줄 (컬럼 명)은 건너뜁니다.

            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(";");
                int contractCode = Integer.parseInt(data[0].trim());
                String accountNo = data[1].trim();
                userDataList.add(new UserData(contractCode, accountNo));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return userDataList;
    }

    public static String generateUpdateQuery(int contractCode, String encryptedAccountNo) {
        return "UPDATE `contract_fortune` SET `encrypt_account_no` = '" + encryptedAccountNo + "' WHERE `contract_code` = " + contractCode + " LIMIT 1;";
    }

    public static String encryptAes(String str, String key) {
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encPassword = cipher.doFinal(str.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encPassword);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    static class UserData {
        private int contractCode;
        private String accountNo;

        public UserData(int contractCode, String accountNo) {
            this.contractCode = contractCode;
            this.accountNo = accountNo;
        }

        public int getContractCode() {
            return contractCode;
        }

        public String getAccountNo() {
            return accountNo;
        }
    }
}
