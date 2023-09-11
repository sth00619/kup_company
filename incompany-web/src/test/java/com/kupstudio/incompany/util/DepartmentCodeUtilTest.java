package com.kupstudio.incompany.util;


import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.Assert.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class DepartmentCodeUtilTest {

    @Test
    void testGetInfo() {
        List<String> info = DepartmentCodeUtil.getInfo("D0102030405");

        assertTrue("D01".equals(info.get(0)));
        assertTrue("D0102".equals(info.get(1)));
        assertTrue("D010203".equals(info.get(2)));
        assertTrue("D01020304".equals(info.get(3)));
        assertTrue("D0102030405".equals(info.get(4)));
    }

    @Test
    void testDepth() {
        assertTrue(DepartmentCodeUtil.getDepth("D0101") == 2);
        assertTrue(DepartmentCodeUtil.getDepth("D1101") == 2);
        assertTrue(DepartmentCodeUtil.getDepth("D010101") == 3);
        assertTrue(DepartmentCodeUtil.getDepth("D100101") == 3);
        assertTrue(DepartmentCodeUtil.getDepth("D10010101") == 4);
    }

    @Test
    void testIsChild() {
        assertTrue(DepartmentCodeUtil.isChild("D01", "D0101"));
        assertTrue(DepartmentCodeUtil.isChild("D0101", "D010101"));
        assertTrue(DepartmentCodeUtil.isChild("D0101", "D010102"));
        assertTrue(DepartmentCodeUtil.isChild("D02", "D0201"));

        assertFalse(DepartmentCodeUtil.isChild("D0201", "D02"));
        assertFalse(DepartmentCodeUtil.isChild("D0201", "D0202"));
        assertFalse(DepartmentCodeUtil.isChild("D0201", "D0203"));
        assertFalse(DepartmentCodeUtil.isChild("D02", "D03"));
    }

    @Test
    void testD1Id() {
        assertTrue(DepartmentCodeUtil.getD1Id("D0101") == 1);
        assertTrue(DepartmentCodeUtil.getD1Id("D1001") == 10);
        assertTrue(DepartmentCodeUtil.getD1Id("D5101") == 51);
        assertTrue(DepartmentCodeUtil.getD1Id("D1234567890") == 12);
        assertTrue(DepartmentCodeUtil.getD2Id("D1234567890") == 34);
        assertTrue(DepartmentCodeUtil.getD3Id("D1234567890") == 56);
        assertTrue(DepartmentCodeUtil.getD4Id("D1234567890") == 78);
        assertTrue(DepartmentCodeUtil.getD5Id("D1234567890") == 90);
        assertTrue(DepartmentCodeUtil.getD5Id("D12345678") == null);
        assertTrue(DepartmentCodeUtil.getD5Id("D12") == null);
    }


//    @Test
//    void testSetNo() {
//        assertTrue("D12095678".equals(DepartmentCodeUtil.setNo("D12345678", 2, 9)));
//        assertTrue("D12385678".equals(DepartmentCodeUtil.setNo("D12345678", 2, 38)));
//        assertTrue("D01345678".equals(DepartmentCodeUtil.setNo("D12345678", 1, 1)));
//        assertTrue("D61345678".equals(DepartmentCodeUtil.setNo("D12345678", 1, 61)));
//        assertTrue("D12345601".equals(DepartmentCodeUtil.setNo("D12345678", 4, 1)));
//        assertTrue("D12345611".equals(DepartmentCodeUtil.setNo("D12345678", 4, 11)));
//        assertTrue("D1234567801".equals(DepartmentCodeUtil.setNo("D12345678", 5, 1)));
//        assertTrue("D1234567811".equals(DepartmentCodeUtil.setNo("D12345678", 5, 11)));
//    }

    @Test
    void testMakeSubDepartmentCode() {
        assertTrue("D120101".equals(DepartmentCodeUtil.makeSubDepartmentCode("D1201")));
        assertTrue("D0101".equals(DepartmentCodeUtil.makeSubDepartmentCode("D01")));
    }

    @Test
    void testAddOne() {
        assertTrue("D1202".equals(DepartmentCodeUtil.addOne("D1201")));
        assertTrue("D02".equals(DepartmentCodeUtil.addOne("D01")));
        assertTrue("D12".equals(DepartmentCodeUtil.addOne("D11")));
    }

}