/**
 * Formata timestamp para tempo relativo (ex: "há 5 minutos")
 */
export function formatRelativeTime(timestamp: number): string {
	const now = Date.now();
	const diff = now - timestamp;
	
	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	
	if (days > 0) return days === 1 ? 'há 1 dia' : `há ${days} dias`;
	if (hours > 0) return hours === 1 ? 'há 1 hora' : `há ${hours} horas`;
	if (minutes > 0) return minutes === 1 ? 'há 1 minuto' : `há ${minutes} minutos`;
	return 'agora';
}

