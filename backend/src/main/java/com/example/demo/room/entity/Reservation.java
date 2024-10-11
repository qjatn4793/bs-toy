package com.example.demo.room.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data // 자동으로 Getter, Setter, toString, equals, hashCode 생성
@Builder // 빌더 패턴을 통해 객체 생성
@AllArgsConstructor // 모든 필드를 포함한 생성자 생성
@NoArgsConstructor // 기본 생성자 생성
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    private LocalDate startDate;
    private LocalDate endDate;

    // 예약 날짜를 나타내는 필드
    private LocalDateTime reservationDate;

}