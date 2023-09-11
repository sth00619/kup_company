package com.kupstudio.incompany.util;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

public class EncryptMobileUtilTest {

    private static final String ENCRYPT_KEY_POTENTIAL_USER = "potential_mobile";

    public static void main(String[] args) throws Exception {
        String csvFile = "C:/Users/82103/Documents/HeidiSQL/updateMobile.csv";
        List<UserData> userDataList = readUserDataFromCSV(csvFile);

        for (UserData userData : userDataList) {
            int potentialUserNo = userData.getPotentialUserNo();
            String mobile = userData.getMobile();
            String encryptedMobile = encryptAes(mobile, ENCRYPT_KEY_POTENTIAL_USER);
            String query = generateUpateQuery(potentialUserNo, encryptedMobile, mobile);
            System.out.println(query);
        }
    }

    public static List<UserData> readUserDataFromCSV(String csvFile) {
        List<UserData> userDataList = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(csvFile))) {
            // 첫번째 줄 건너뛰기
            br.readLine();

            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split(",");
                int potentialUserNo = Integer.parseInt(data[0].trim());
                String mobile = data[1].trim();
                userDataList.add(new UserData(potentialUserNo, mobile));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return userDataList;
    }

    public static String generateUpateQuery(int potentialUserNo, String encryptedMobile, String mobile) {
        return "UPDATE `potential_user` SET `encrypt_mobile` = '" + encryptedMobile + "' WHERE `potential_user_no` = " + potentialUserNo + " AND `mobile` = '" + mobile + " LIMIT 1;";
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
        private int potentialUserNo;
        private String mobile;

        public UserData(int potentialUserNo, String mobile) {
            this.potentialUserNo = potentialUserNo;
            this.mobile = mobile;
        }

        public int getPotentialUserNo() {
            return potentialUserNo;
        }

        public String getMobile() {
            return mobile;
        }
    }
}