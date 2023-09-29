import {
	Card,
	CardHeader,
	CardBody,
	Heading,
	Stat,
	StatLabel,
	StatNumber,
} from "@chakra-ui/react";
import React from "react";

function StatCard({ backgroundColor, textColor, heading, label, stats }) {
	return (
		<Card bg={backgroundColor} color={textColor}>
			<CardHeader>
				<Heading size="md">{heading}</Heading>
			</CardHeader>
			<CardBody pt={0}>
				<Stat>
					<StatLabel>{label}</StatLabel>
					<StatNumber>{stats}</StatNumber>
				</Stat>
			</CardBody>
		</Card>
	);
}

export default StatCard;
