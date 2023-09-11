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

public class EncryptLocationUtilTest {

    public static final String ENCRYPT_LOCATION = "po_user_location";

    public static void main(String[] args) throws Exception {
        String txtFile = "C:/Users/82103/Documents/HeidiSQL/location.txt";

        List<UserData> userDataList = readUserDataFromTxt(txtFile);

        for (UserData userData : userDataList) {
            int potentialUserNo = userData.getPotentialUserNo();
            String location = userData.getLocation();
            String encryptedLocation = encryptAes(location, ENCRYPT_LOCATION);
            String query = generateUpdateQuery(potentialUserNo, encryptedLocation);
            System.out.println(query);
        }
    }

    // feature/issue1592는 ""가 있는 경우의 쿼리문 생성, feature/issue1594는 ""가 없는 경우의 쿼리문 생성
    public static List<UserData> readUserDataFromTxt(String txtFile) {
        List<UserData> userDataList = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(txtFile))) {
            // Skip the header (first line with column names)
            br.readLine();

            String line;
            while ((line = br.readLine()) != null) {
                String[] data = line.split("\";\"");
                int potentialUserNo = Integer.parseInt(data[0].substring(1).trim());
                String location = data[1].substring(0, data[1].length() - 1).trim();
                userDataList.add(new UserData(potentialUserNo, location));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return userDataList;
    }

    public static String generateUpdateQuery(int potentialUserNo, String encryptedLocation) {
        return "UPDATE `potential_user` SET `encrypt_location` = '" + encryptedLocation + "' WHERE `potential_user_no` = " + potentialUserNo + " LIMIT 1;";
    }

    public static String encryptAes(String str, String key) {
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES");
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encLocation = cipher.doFinal(str.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encLocation);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    static class UserData {
        private int potentialUserNo;
        private String location;

        public UserData(int potentialUserNo, String location) {
            this.potentialUserNo = potentialUserNo;
            this.location = location;
        }

        public int getPotentialUserNo() {
            return potentialUserNo;
        }

        public String getLocation() {
            return location;
        }
    }
}
