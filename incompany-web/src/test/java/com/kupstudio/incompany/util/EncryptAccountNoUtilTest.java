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

public class EncryptAccountNoUtilTest {

    private static final String ENCRYPT_KEY_ACCOUNT_NO = "_bank_account_no";

    public static void main(String[] args) throws Exception {

        // real의 계좌번호를 update하는 쿼리문이기 때문에 생성 후 확인 필요
        String csvFile = "C:/Users/82103/Documents/HeidiSQL/realAccountNo.csv";

        List<UserData> userDataList = readUserDataFromCSV(csvFile);

        for (UserData userData : userDataList) {
            int contractCode = userData.getContractCode();
            String accountNo = userData.getAccountNo();
            String encryptedAccountNo = encryptAes(accountNo, ENCRYPT_KEY_ACCOUNT_NO);
            String query = generateUpdateQuery(contractCode, encryptedAccountNo);
            System.out.println(query);
        }
    }

    public static List<UserData> readUserDataFromCSV(String csvFile) {
        List<UserData> userDataList = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
            // 첫 번째 줄(헤더)을 읽고 건너뜁니다.
            br.readLine();

            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(",");
                int contractCode = Integer.parseInt(data[0].trim()); // 공백 제거 후 숫자로 변환
                String accountNo = data[1].trim(); // 공백 제거
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
